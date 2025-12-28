package com.net.alex.bingo.game;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.*;
import java.io.*;
import java.nio.file.*;

@Controller
public class BingoController {
    
    private List<Integer> calledNumbers = new ArrayList<>();
    private Random random = new Random();
    private List<int[][]> playerCards = new ArrayList<>();
    private boolean gameStarted = false;
    
    @GetMapping("/")
    public String index() {
        return "bingo";
    }
    
    @GetMapping("/bingo")
    public String bingo() {
        return "bingo";
    }
    
    @GetMapping("/recorder")
    public String recorder() {
        return "recorder";
    }
    
    @PostMapping("/generate-cards")
    @ResponseBody
    public Map<String, Object> generateCards(@RequestParam int numberOfCards) {
        playerCards.clear();
        List<int[][]> cards = new ArrayList<>();
        
        for (int i = 0; i < numberOfCards; i++) {
            int[][] card = generateBingoCard();
            playerCards.add(card);
            cards.add(card);
        }
        
        return Map.of("cards", cards);
    }
    
    @PostMapping("/call-number")
    @ResponseBody
    public Map<String, Object> callNumber() {
        List<Integer> availableNumbers = new ArrayList<>();
        for (int i = 1; i <= 75; i++) {
            if (!calledNumbers.contains(i)) {
                availableNumbers.add(i);
            }
        }
        
        Map<String, Object> response = new HashMap<>();
        if (availableNumbers.isEmpty()) {
            response.put("gameOver", true);
            response.put("message", "All numbers have been called!");
            return response;
        }
        
        int calledNumber = availableNumbers.get(random.nextInt(availableNumbers.size()));
        calledNumbers.add(calledNumber);
        gameStarted = true;
        
        // Check for winners
        List<Integer> winners = checkWinners();
        
        response.put("number", calledNumber);
        response.put("calledNumbers", new ArrayList<>(calledNumbers));
        response.put("winners", winners);
        response.put("gameStarted", gameStarted);
        
        return response;
    }
    
    @PostMapping("/reset")
    @ResponseBody
    public Map<String, String> resetGame() {
        calledNumbers.clear();
        playerCards.clear();
        gameStarted = false;
        return Map.of("status", "reset");
    }
    
    @PostMapping("/upload-sound")
    @ResponseBody
    public Map<String, String> uploadSound(@RequestParam("file") MultipartFile file, 
                                         @RequestParam("number") int number) {
        try {
            String filename = "amharic-" + number + ".aac";
            Path soundsDir = Paths.get("src/main/resources/static/sounds/numbers");
            Files.createDirectories(soundsDir);
            Path filePath = soundsDir.resolve(filename);
            Files.write(filePath, file.getBytes());
            return Map.of("status", "success", "message", "Sound uploaded for number " + number);
        } catch (IOException e) {
            return Map.of("status", "error", "message", "Failed to upload: " + e.getMessage());
        }
    }
    
    private int[][] generateBingoCard() {
        int[][] card = new int[5][5];
        Random rand = new Random();
        
        // B column (1-15)
        Set<Integer> bNumbers = new HashSet<>();
        while (bNumbers.size() < 5) {
            bNumbers.add(rand.nextInt(15) + 1);
        }
        Integer[] bArray = bNumbers.toArray(new Integer[0]);
        for (int i = 0; i < 5; i++) {
            card[i][0] = bArray[i];
        }
        
        // I column (16-30)
        Set<Integer> iNumbers = new HashSet<>();
        while (iNumbers.size() < 5) {
            iNumbers.add(rand.nextInt(15) + 16);
        }
        Integer[] iArray = iNumbers.toArray(new Integer[0]);
        for (int i = 0; i < 5; i++) {
            card[i][1] = iArray[i];
        }
        
        // N column (31-45) - center is free
        Set<Integer> nNumbers = new HashSet<>();
        while (nNumbers.size() < 4) {
            nNumbers.add(rand.nextInt(15) + 31);
        }
        Integer[] nArray = nNumbers.toArray(new Integer[0]);
        int nIndex = 0;
        for (int i = 0; i < 5; i++) {
            if (i == 2) {
                card[i][2] = 0; // Free space
            } else {
                card[i][2] = nArray[nIndex++];
            }
        }
        
        // G column (46-60)
        Set<Integer> gNumbers = new HashSet<>();
        while (gNumbers.size() < 5) {
            gNumbers.add(rand.nextInt(15) + 46);
        }
        Integer[] gArray = gNumbers.toArray(new Integer[0]);
        for (int i = 0; i < 5; i++) {
            card[i][3] = gArray[i];
        }
        
        // O column (61-75)
        Set<Integer> oNumbers = new HashSet<>();
        while (oNumbers.size() < 5) {
            oNumbers.add(rand.nextInt(15) + 61);
        }
        Integer[] oArray = oNumbers.toArray(new Integer[0]);
        for (int i = 0; i < 5; i++) {
            card[i][4] = oArray[i];
        }
        
        return card;
    }
    
    private List<Integer> checkWinners() {
        List<Integer> winners = new ArrayList<>();
        
        for (int cardIndex = 0; cardIndex < playerCards.size(); cardIndex++) {
            int[][] card = playerCards.get(cardIndex);
            boolean isWinner = false;
            
            // Check rows
            for (int row = 0; row < 5 && !isWinner; row++) {
                boolean rowWin = true;
                for (int col = 0; col < 5; col++) {
                    int cellValue = card[row][col];
                    // FREE space (0) is always considered called
                    if (cellValue != 0 && !calledNumbers.contains(cellValue)) {
                        rowWin = false;
                        break;
                    }
                }
                if (rowWin) {
                    winners.add(cardIndex + 1);
                    isWinner = true;
                }
            }
            
            // Check columns
            for (int col = 0; col < 5 && !isWinner; col++) {
                boolean colWin = true;
                for (int row = 0; row < 5; row++) {
                    int cellValue = card[row][col];
                    // FREE space (0) is always considered called
                    if (cellValue != 0 && !calledNumbers.contains(cellValue)) {
                        colWin = false;
                        break;
                    }
                }
                if (colWin) {
                    winners.add(cardIndex + 1);
                    isWinner = true;
                }
            }
            
            // Check diagonals
            if (!isWinner) {
                boolean diag1 = true, diag2 = true;
                for (int i = 0; i < 5; i++) {
                    int cellValue1 = card[i][i];
                    int cellValue2 = card[i][4-i];
                    
                    // FREE space (0) is always considered called
                    if (cellValue1 != 0 && !calledNumbers.contains(cellValue1)) {
                        diag1 = false;
                    }
                    if (cellValue2 != 0 && !calledNumbers.contains(cellValue2)) {
                        diag2 = false;
                    }
                }
                if (diag1 || diag2) {
                    winners.add(cardIndex + 1);
                }
            }
        }
        
        return winners;
    }
}