package com.property.rent.Repositories;

import com.property.rent.Entities.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InquiryRepository extends JpaRepository<Inquiry, Long> {

    // Намира всички запитвания за конкретна обява (за да ги види брокерът)
    List<Inquiry> findByPropertyId(Long propertyId);

    // Намира запитвания по техния статус (напр. само новите `NEW`, на които не е отговорено)
    List<Inquiry> findByStatus(Inquiry.InquiryStatus status);
}
