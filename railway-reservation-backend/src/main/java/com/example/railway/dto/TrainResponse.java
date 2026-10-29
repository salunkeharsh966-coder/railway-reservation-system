package com.example.railway.dto;

import com.example.railway.entity.Train;
import lombok.*;

import java.math.BigDecimal;

/** Train view returned to the client. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainResponse {
    private Long id;
    private String trainNumber;
    private String trainName;
    private String source;
    private String destination;
    private String departureTime;
    private String arrivalTime;
    private Integer distance;
    private String trainType;
    private Integer availableSeats;
    private BigDecimal fareSleeper;
    private BigDecimal fareAc3;
    private BigDecimal fareAc2;
    private BigDecimal fareAc1;
    private BigDecimal fareCc;

    public static TrainResponse from(Train t) {
        return TrainResponse.builder()
                .id(t.getId())
                .trainNumber(t.getTrainNumber())
                .trainName(t.getTrainName())
                .source(t.getSource())
                .destination(t.getDestination())
                .departureTime(t.getDepartureTime())
                .arrivalTime(t.getArrivalTime())
                .distance(t.getDistance())
                .trainType(t.getTrainType())
                .availableSeats(t.getAvailableSeats())
                .fareSleeper(t.getFareSleeper())
                .fareAc3(t.getFareAc3())
                .fareAc2(t.getFareAc2())
                .fareAc1(t.getFareAc1())
                .fareCc(t.getFareCc())
                .build();
    }
}
