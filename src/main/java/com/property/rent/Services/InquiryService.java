package com.property.rent.Services;

import com.property.rent.Entities.Inquiry;
import com.property.rent.Entities.Property;
import com.property.rent.Repositories.InquiryRepository;
import com.property.rent.Repositories.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InquiryService {

    private final InquiryRepository inquiryRepository;
    private final PropertyRepository propertyRepository;

    public Inquiry createInquiry(Long propertyId, Inquiry inquiryDetails) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        inquiryDetails.setProperty(property);
        return inquiryRepository.save(inquiryDetails);
    }

    public List<Inquiry> getInquiriesForProperty(Long propertyId) {
        return inquiryRepository.findByPropertyId(propertyId);
    }

    public Inquiry updateStatus(Long inquiryId, Inquiry.InquiryStatus status) {
        Inquiry inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new RuntimeException("Inquiry not found"));
        inquiry.setStatus(status);
        return inquiryRepository.save(inquiry);
    }

    public void deleteInquiry(Long id) {
        if (!inquiryRepository.existsById(id)) {
            throw new RuntimeException("Запитването не е намерено");
        }
        inquiryRepository.deleteById(id);
    }
}