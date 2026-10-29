package com.example.railway.service;

import com.example.railway.dto.TrainRequest;
import com.example.railway.dto.TrainResponse;
import com.example.railway.entity.Train;
import com.example.railway.exception.BadRequestException;
import com.example.railway.exception.ResourceNotFoundException;
import com.example.railway.repository.TrainRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Train CRUD and search. */
@Service
public class TrainService {

    private final TrainRepository trainRepository;

    public TrainService(TrainRepository trainRepository) {
        this.trainRepository = trainRepository;
    }

    @Transactional(readOnly = true)
    public List<TrainResponse> getAllTrains() {
        return trainRepository.findAll().stream().map(TrainResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public TrainResponse getTrainById(Long id) {
        return TrainResponse.from(findOrThrow(id));
    }

    @Transactional(readOnly = true)
    public List<TrainResponse> searchTrains(String source, String destination) {
        if (source == null || source.isBlank() || destination == null || destination.isBlank()) {
            throw new BadRequestException("Both source and destination are required for a search");
        }
        return trainRepository.searchTrains(source.trim(), destination.trim())
                .stream().map(TrainResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<String> getSources() {
        return trainRepository.findDistinctSources();
    }

    @Transactional(readOnly = true)
    public List<String> getDestinations() {
        return trainRepository.findDistinctDestinations();
    }

    @Transactional
    public TrainResponse createTrain(TrainRequest request) {
        if (trainRepository.existsByTrainNumber(request.getTrainNumber().trim())) {
            throw new BadRequestException("A train with number " + request.getTrainNumber() + " already exists");
        }
        Train train = new Train();
        apply(train, request);
        return TrainResponse.from(trainRepository.save(train));
    }

    @Transactional
    public TrainResponse updateTrain(Long id, TrainRequest request) {
        Train train = findOrThrow(id);
        trainRepository.findByTrainNumber(request.getTrainNumber().trim())
                .filter(other -> !other.getId().equals(id))
                .ifPresent(other -> {
                    throw new BadRequestException("A train with number " + request.getTrainNumber() + " already exists");
                });
        apply(train, request);
        return TrainResponse.from(trainRepository.save(train));
    }

    @Transactional
    public void deleteTrain(Long id) {
        Train train = findOrThrow(id);
        trainRepository.delete(train);
    }

    private Train findOrThrow(Long id) {
        return trainRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Train not found with id " + id));
    }

    private void apply(Train train, TrainRequest r) {
        train.setTrainNumber(r.getTrainNumber().trim());
        train.setTrainName(r.getTrainName().trim());
        train.setSource(r.getSource().trim());
        train.setDestination(r.getDestination().trim());
        train.setDepartureTime(r.getDepartureTime());
        train.setArrivalTime(r.getArrivalTime());
        train.setDistance(r.getDistance());
        train.setTrainType(r.getTrainType());
        train.setAvailableSeats(r.getAvailableSeats());
        train.setFareSleeper(r.getFareSleeper());
        train.setFareAc3(r.getFareAc3());
        train.setFareAc2(r.getFareAc2());
        train.setFareAc1(r.getFareAc1());
        train.setFareCc(r.getFareCc());
    }
}
