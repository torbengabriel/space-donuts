package com.spacedonuts.order.repository;

import com.spacedonuts.order.entity.OutboxEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OutboxEventRepository
  extends JpaRepository<OutboxEvent, Long> {

  List<OutboxEvent> findTop50ByPublishedAtIsNullOrderByCreatedAtAsc();
}
