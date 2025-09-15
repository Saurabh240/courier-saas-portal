package com.courier.app.orders.model;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GeoLocation {

    @NotNull(message="Enter latitude")
    @DecimalMin(value="-90",inclusive=true,message = "Latitude must be >= -90")
    @DecimalMax(value="90",inclusive=true,message="Latitude must be <= 90")
    private double lat;

    @NotNull(message="Enter longitude")
    @DecimalMin(value="-180",inclusive = true,message = "Longitude must be >= -180")
    @DecimalMax(value = "180",inclusive = true,message = "Longitude must be <= 180")
    private double lng;

    private String city;

    @Pattern(
            regexp = "^[A-Za-z0-9\\s-]{3,12}$",
            message = "postalCode must be 3-12 chars: letters, digits, spaces or hyphens"
    )
    private String postalCode;
    private String formattedAddress;
}
