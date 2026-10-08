package com.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.entity.Student;
import com.service.StudentService;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // =========================================================
    // CREATE
    // =========================================================

    @PostMapping("/create")
    public ResponseEntity<Student> createStudent(
            @RequestBody Student student) {

        Student createdStudent =
                studentService.createStudent(student);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdStudent);
    }

    // =========================================================
    // READ ONE
    // =========================================================

    @GetMapping("/get/{id}")
    public ResponseEntity<Student> getStudentById(
            @PathVariable Long id) {

        Student student =
                studentService.getStudentById(id);

        if (student == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .build();
        }

        return ResponseEntity.ok(student);
    }

    // =========================================================
    // READ ALL
    // Active + Deleted
    // =========================================================

    @GetMapping("/getAll")
    public ResponseEntity<List<Student>> getAllStudents() {

        List<Student> students =
                studentService.getAllStudents();

        /*
         * Even if there are zero records,
         * return 200 OK with [].
         */
        return ResponseEntity.ok(students);
    }

    // =========================================================
    // READ ACTIVE
    // =========================================================

    @GetMapping("/getActive")
    public ResponseEntity<List<Student>> getActiveStudents() {

        List<Student> students =
                studentService.getActiveStudents();

        return ResponseEntity.ok(students);
    }

    // =========================================================
    // UPDATE
    // =========================================================

    @PutMapping("/update/{id}")
    public ResponseEntity<Student> updateStudent(
            @PathVariable Long id,
            @RequestBody Student student) {

        Student updatedStudent =
                studentService.updateStudent(id, student);

        if (updatedStudent == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .build();
        }

        return ResponseEntity.ok(updatedStudent);
    }

    // =========================================================
    // HARD DELETE
    // =========================================================

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteStudent(
            @PathVariable Long id) {

        boolean isDeleted =
                studentService.deleteStudent(id);

        if (!isDeleted) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Student not found");
        }

        return ResponseEntity.ok(
                "Record deleted successfully"
        );
    }

    // =========================================================
    // SOFT DELETE
    // =========================================================

    @PatchMapping("/deleteSoft/{id}")
    public ResponseEntity<String> deleteStudentSoft(
            @PathVariable Long id) {

        boolean isDeleted =
                studentService.deleteStudentSoft(id);

        if (!isDeleted) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Active student not found");
        }

        return ResponseEntity.ok(
                "Record soft deleted successfully"
        );
    }

    // =========================================================
    // RESTORE
    // =========================================================

    @PatchMapping("/restore/{id}")
    public ResponseEntity<String> restoreStudent(
            @PathVariable Long id) {

        boolean isRestored =
                studentService.restoreStudent(id);

        if (!isRestored) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Deleted student not found");
        }

        return ResponseEntity.ok(
                "Record restored successfully"
        );
    }
}