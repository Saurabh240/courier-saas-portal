package com.courier.app.usermgmt.config;

import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

@Component
@DependsOn("flywayInitializer")
public class DefaultTenantMigrationRunner implements ApplicationRunner {

    private final DataSource dataSource;
    private final String defaultSchema;

    public DefaultTenantMigrationRunner(
            DataSource dataSource,
            @Value("${app.default-tenant-schema:public}") String defaultSchema
    ) {
        this.dataSource = dataSource;
        this.defaultSchema = defaultSchema;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        try (Connection connection = dataSource.getConnection();
             Statement statement = connection.createStatement()) {
            statement.execute("CREATE SCHEMA IF NOT EXISTS " + quote(defaultSchema));
        }

        Flyway.configure()
                .dataSource(dataSource)
                .locations("classpath:db/migration_tenant")
                .schemas(defaultSchema)
                .defaultSchema(defaultSchema)
                .table("flyway_tenant_schema_history")
                .createSchemas(false)
                .baselineOnMigrate(true)
                .load()
                .migrate();
    }

    private String quote(String identifier) {
        return "\"" + identifier.replace("\"", "\"\"") + "\"";
    }
}
