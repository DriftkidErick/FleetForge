package com.fleetforge.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    //Creates the BCrypt tool to Hash and verify the passwords
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    //Denifes the login, logout, and API access security rules
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                //Disables the CSRF tokens fro requests from REACT Frontend
                .csrf(csrf -> csrf.disable())

                //Allows login without authentication and protects other endpoints
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/login").permitAll()
                        .anyRequest().authenticated()
                )

                //Configures session based login using email and password
                .formLogin(form -> form
                        .loginProcessingUrl("/api/auth/login")
                        .usernameParameter("email")

                        //Returns HTTP 200 when login is successful
                        .successHandler((request, response, authentication) ->
                                response.setStatus(
                                        HttpServletResponse.SC_OK
                                )
                        )

                        //Returns HTTP 401 when the credentials are incorrect
                        .failureHandler((request, response, exception) ->
                                response.sendError(
                                        HttpServletResponse.SC_UNAUTHORIZED,
                                        "Invalid email or password"
                                )
                        )

                        .permitAll()
                )

                //Configures logout and removes the authenicatied session
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")

                        //Returns HTTP 204 when logout succeeds
                        .logoutSuccessHandler(
                                (request, response, authentication) ->
                                        response.setStatus(
                                                HttpServletResponse.SC_NO_CONTENT
                                        )
                        )

                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                )

                //Returns 401 instead of redirecting API user to an HTML page
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(
                                (request, response, exception) ->
                                        response.sendError(
                                                HttpServletResponse.SC_UNAUTHORIZED
                                        )
                        )
                );

        return http.build();
    }
}