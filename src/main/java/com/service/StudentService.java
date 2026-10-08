package com.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.entity.Student;
import com.repository.StudentRepository;

@Service
@Transactional
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // =========================================================
    // CREATE
    // =========================================================

    public Student createStudent(Student studentReq) {

        /*
         * Every newly created student must be active.
         */
        studentReq.setIsDeleted(false);

        return studentRepository.save(studentReq);
    }

    // =========================================================
    // READ ONE - ACTIVE + DELETED
    // =========================================================

    public Student getStudentById(Long id) {

        return studentRepository.findById(id)
                .orElse(null);
    }

    // =========================================================
    // READ ALL - ACTIVE + DELETED
    // =========================================================

    public List<Student> getAllStudents() {

        return studentRepository.findAll();
    }

    // =========================================================
    // READ ACTIVE STUDENTS
    // =========================================================

    public List<Student> getActiveStudents() {

        return studentRepository.findAllByIsDeletedFalse();
    }

    // =========================================================
    // UPDATE
    // =========================================================

    public Student updateStudent(Long id, Student studentReq) {

        /*
         * Only active students can be updated.
         */
        Optional<Student> existingStudent =
                studentRepository.findByIdAndIsDeletedFalse(id);

        if (existingStudent.isEmpty()) {
            return null;
        }

        Student studentToUpdate = existingStudent.get();

        studentToUpdate.setName(studentReq.getName());
        studentToUpdate.setAge(studentReq.getAge());
        studentToUpdate.setEmail(studentReq.getEmail());
        studentToUpdate.setRollNo(studentReq.getRollNo());
        studentToUpdate.setAddress(studentReq.getAddress());

        /*
         * We deliberately do NOT update isDeleted
         * from the frontend request.
         */
        studentToUpdate.setIsDeleted(false);

        return studentRepository.save(studentToUpdate);
    }

    // =========================================================
    // HARD DELETE
    // =========================================================

    public boolean deleteStudent(Long id) {

        if (!studentRepository.existsById(id)) {
            return false;
        }

        studentRepository.deleteById(id);

        return true;
    }

    // =========================================================
    // SOFT DELETE
    // =========================================================

    public boolean deleteStudentSoft(Long id) {

        Optional<Student> existingStudent =
                studentRepository.findByIdAndIsDeletedFalse(id);

        if (existingStudent.isEmpty()) {
            return false;
        }

        Student studentToUpdate = existingStudent.get();

        studentToUpdate.setIsDeleted(true);

        studentRepository.save(studentToUpdate);

        return true;
    }

    // =========================================================
    // RESTORE
    // =========================================================

    public boolean restoreStudent(Long id) {

        /*
         * Restore only a student which is currently deleted.
         */
        Optional<Student> existingStudent =
                studentRepository.findByIdAndIsDeletedTrue(id);

        if (existingStudent.isEmpty()) {
            return false;
        }

        Student studentToRestore = existingStudent.get();

        studentToRestore.setIsDeleted(false);

        studentRepository.save(studentToRestore);

        return true;
    }
}