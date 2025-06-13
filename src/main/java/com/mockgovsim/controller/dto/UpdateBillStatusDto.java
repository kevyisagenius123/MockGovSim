package com.mockgovsim.controller.dto;

import com.mockgovsim.domain.BillStatus;
import lombok.Data;

@Data
public class UpdateBillStatusDto {
    private BillStatus status;
} 