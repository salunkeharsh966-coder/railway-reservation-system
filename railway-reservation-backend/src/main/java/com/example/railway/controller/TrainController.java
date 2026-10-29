package com.example.railway.controller;

import com.example.railway.dto.MessageResponse;
import com.example.railway.dto.TrainRequest;
import com.example.railway.dto.TrainResponse;
import com.example.railway.service.TrainService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Train CRUD and search endpoints.
 *
 * GET    /api/trains
 * GET    /api/trains/{id}
 * GET    /api/trains/search?source=..&destination=..
 * GET    /api/trains/stations
 * POST   /api/trains
 * PUT    /api/trains/{id}
 * DELETE /api/trains/{id}
 */
@RestController
@RequestMapping("/api/trains")
public class TrainController {

    private final TrainService trainService;

    public TrainController(TrainService trainService) {
        this.trainService = trainService;
    }

    @GetMapping
    public ResponseEntity<List<TrainResponse>> getAllTrains() {
        return ResponseEntity.ok(trainService.getAllTrains());
    }

    @GetMapping("/search")
    public ResponseEntity<List<TrainResponse>> searchTrains(
            @RequestParam String source,
            @RequestParam String destination) {
        return ResponseEntity.ok(trainService.searchTrains(source, destination));
    }

    @GetMapping("/stations")
    public ResponseEntity<Map<String, List<String>>> stations() {
        // Convenience endpoint returning both station lists as one JSON object.
        Map<String, List<String>> body = new LinkedHashMap<>();
        body.put("sources", trainService.getSources());
        body.put("destinations", trainService.getDestinations());
        return ResponseEntity.ok(body);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainResponse> getTrainById(@PathVariable Long id) {
        return ResponseEntity.ok(trainService.getTrainById(id));
    }

    @PostMapping
    public ResponseEntity<TrainResponse> createTrain(@Valid @RequestBody TrainRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(trainService.createTrain(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrainResponse> updateTrain(@PathVariable Long id,
                                                     @Valid @RequestBody TrainRequest request) {
        return ResponseEntity.ok(trainService.updateTrain(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteTrain(@PathVariable Long id) {
        trainService.deleteTrain(id);
        return ResponseEntity.ok(new MessageResponse("Train deleted successfully"));
    }
}
