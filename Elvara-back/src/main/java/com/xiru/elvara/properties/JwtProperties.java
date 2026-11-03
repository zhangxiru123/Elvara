package com.xiru.elvara.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "elvara.jwt")
@Data
public class JwtProperties {
    private String secretKey;
    private long ttl;
    private String tokenName;
}
