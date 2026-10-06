package com.fleetforge.controller;

import com.fleetforge.entity.Assignment;
import com.fleetforge.service.AssignmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService){
        this.assignmentService = assignmentService;
    }

    @GetMapping
    public List<Assignment> getAllAssignments(){
        return assignmentService.getAllAssignments();

    }

    @GetMapping("/{id}")
    public Assignment getAssignmentById(@PathVariable Long id){
        return assignmentService.getAssignmentById(id);
    }

    @PostMapping
    public Assignment createAssignment(@Valid @RequestBody Assignment assignment){
        return assignmentService.createAssignment(assignment);
    }

    @PutMapping("/{id}")
    public Assignment updateAssignment(@PathVariable Long id, @Valid @RequestBody Assignment assignment){
        return assignmentService.updateAssignment(id, assignment);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id){
        assignmentService.deleteAssignment(id);
        return ResponseEntity.noContent().build();
    }
}
