package com.courier.app.settings.config;

import com.courier.app.settings.multiTenancy.SchemaMultiTenantConnectionProvider;
import com.courier.app.settings.multiTenancy.TenantIdentifierResolver;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class HibernateMultiTenancyConfig {

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(
            DataSource dataSource,
            EntityManagerFactoryBuilder builder,
            SchemaMultiTenantConnectionProvider connectionProvider,
            TenantIdentifierResolver tenantIdentifierResolver
    ) {
        Map<String, Object> jpaProps = new HashMap<>();
        jpaProps.put("hibernate.multi_tenant_connection_provider", connectionProvider);
        jpaProps.put("hibernate.tenant_identifier_resolver", tenantIdentifierResolver);

        return builder
                .dataSource(dataSource)
                .packages("com.courier.app") // Adjust to your base package for entities
                .properties(jpaProps)
                .build();
    }
}
