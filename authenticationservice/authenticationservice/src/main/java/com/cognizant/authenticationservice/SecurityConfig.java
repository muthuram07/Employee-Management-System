package com.cognizant.authenticationservice;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration

@EnableMethodSecurity

public class SecurityConfig {

	@Autowired

	private JwtRequestFilter jwtAuthFilter;

	@Bean

	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

		http.csrf(AbstractHttpConfigurer::disable)// cross-site-requeust-forgery

				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

				.authorizeHttpRequests(auth -> auth

						.requestMatchers("/api/auth/**", "/api/shift/**", "/api/employee/**", "/api/leave/**",
								"/api/leaveBalance/**")
						.permitAll()

						.requestMatchers("/api/manager/**").hasRole("MANAGER")

						.requestMatchers("/api/attendance/**").hasAnyRole("EMPLOYEE", "MANAGER")

						.anyRequest().authenticated()

				)

				.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();

	}

	@Bean

	public PasswordEncoder passwordEncoder() {

		return new BCryptPasswordEncoder();

	}

	@Bean

	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {

		return config.getAuthenticationManager();

	}
	
	@Bean
	 
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:3000")); // Allow frontend origin

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH")); // Allow necessary methods

        config.setAllowedHeaders(List.of("*")); // Allow all headers

        config.setAllowCredentials(true); // Enable credentials
 
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;

    }
 
    @Bean

    public CorsFilter corsFilter() {

        return new CorsFilter(corsConfigurationSource());

    }

}
