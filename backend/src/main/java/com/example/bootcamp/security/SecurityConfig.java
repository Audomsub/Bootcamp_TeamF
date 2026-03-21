package com.example.bootcamp.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import java.util.List;

/**
 * Security Configuration
 *
 * Public endpoints (no auth required):
 * - POST /login — Unified login for Admin & Reseller
 * - POST /register — Reseller registration
 * - GET /shop/** — Customer storefront (public)
 * - GET /track-order — Customer order tracking (public)
 * - GET /catalog — Public product catalog
 * - OPTIONS /** — CORS preflight
 *
 * Protected endpoints:
 * - /admin/** — Requires ROLE_ADMIN
 * - /reseller/** — Requires ROLE_RESELLER
 *
 * All other requests also require authentication.
 * The JWT filter sets the authentication context from the Bearer token.
 */
@Configuration
@EnableWebSecurity(debug = true)
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring()
                .requestMatchers("/api/approved-shops", "/api/approved-shops/**");
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // ─── Absolute Top: Public Shop API ───────────────────────
                        .requestMatchers("/api/approved-shops", "/api/approved-shops/**").permitAll()
                        // ─── Allow CORS preflight ───────────────────────────────
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // ─── Public: Auth endpoints ─────────────────────────────
                        .requestMatchers(HttpMethod.POST, "/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/register").permitAll()

                        // ─── Public: Static Resources ──────────────────────────
                        .requestMatchers("/", "/index.html", "/*.js", "/*.css", "/*.png", "/*.svg", "/*.ico",
                                "/assets/**", "/static/**", "/uploads/**")
                        .permitAll()

                        // ─── Public: Customer-facing endpoints ──────────────────
                        .requestMatchers(HttpMethod.GET, "/shop", "/shop/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/shop/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/track-order", "/catalog").permitAll()

                        // ─── Protected: Admin (ROLE_ADMIN required) ─────────────
                        .requestMatchers("/admin/**").hasRole("ADMIN")

                        // ─── Protected: Reseller (ROLE_RESELLER required) ────────
                        .requestMatchers("/reseller/**").hasRole("RESELLER")

                        // ─── Everything else requires authentication ─────────────
                        .anyRequest().authenticated())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(false);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}