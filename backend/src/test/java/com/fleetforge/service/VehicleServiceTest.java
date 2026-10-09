package com.fleetforge.service;

import com.fleetforge.entity.Vehicle;
import com.fleetforge.repository.VehicleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class VehicleServiceTest {

    //Here we create a fake repository so the test does not use PostgreSQL
    @Mock
    private VehicleRepository vehicleRepository;

    //Creates the service and gives it the fake repository
    @InjectMocks
    private VehicleService vehicleService;

    //Tests that an existing vehicle is returned correctly
    @Test
    public void getVehicleByIdReturnsVehicle() {
        Vehicle vehicle = new Vehicle();
        vehicle.setId(1L);
        vehicle.setMake("Ford");
        vehicle.setModel("Transit");

        //Tells the fake repository what to return for ID 1
        when(vehicleRepository.findById(1L))
                .thenReturn(Optional.of(vehicle));

        Vehicle result = vehicleService.getVehicleById(1L);

        //Verifies that the returned vehicle has the expected information
        assertEquals(1L, result.getId());
        assertEquals("Ford", result.getMake());
        assertEquals("Transit", result.getModel());
    }

    //Tests that requesting a missing vehicle produces an error
    @Test
    public void getVehicleByIdThrowsErrorWhenNotFound() {
        //Tells the fake repository that ID 99 does not exist
        when(vehicleRepository.findById(99L))
                .thenReturn(Optional.empty());

        //Verifies that the service throws the expected exception
        assertThrows(
                ResponseStatusException.class,
                () -> vehicleService.getVehicleById(99L)
        );
    }
}