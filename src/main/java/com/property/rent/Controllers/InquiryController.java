package com.property.rent.Controllers;

import com.property.rent.Entities.Inquiry;
import com.property.rent.Services.InquiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inquiries")
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryService inquiryService;

    // Изпращане на запитване от клиент за конкретен имот
    @PostMapping("/property/{propertyId}")
    public ResponseEntity<Inquiry> createInquiry(
            @PathVariable Long propertyId,
            @RequestBody Inquiry inquiry) {
        Inquiry savedInquiry = inquiryService.createInquiry(propertyId, inquiry);
        return ResponseEntity.ok(savedInquiry);
    }

    // Взимане на запитванията за даден имот (за брокера)
    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<Inquiry>> getInquiriesForProperty(@PathVariable Long propertyId) {
        return ResponseEntity.ok(inquiryService.getInquiriesForProperty(propertyId));
    }

    // Промяна на статуса на запитването (напр. от NEW на CONTACTED)
    @PatchMapping("/{id}/status")
    public ResponseEntity<Inquiry> updateStatus(
            @PathVariable Long id,
            @RequestParam Inquiry.InquiryStatus status) {
        return ResponseEntity.ok(inquiryService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInquiry(@PathVariable Long id) {
        inquiryService.deleteInquiry(id);
        return ResponseEntity.noContent().build(); // Връща 204 No Content при успешно изтриване
    }
}