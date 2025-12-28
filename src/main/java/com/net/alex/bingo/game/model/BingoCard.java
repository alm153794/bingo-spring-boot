package com.net.alex.bingo.game.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class BingoCard {
    private final int[][] grid = new int[5][5];

    public BingoCard() {
        generateColumn(0, 1, 15);  // B
        generateColumn(1, 16, 30); // I
        generateColumn(2, 31, 45); // N
        generateColumn(3, 46, 60); // G
        generateColumn(4, 61, 75); // O
    }

    private void generateColumn(int col, int min, int max) {
        List<Integer> numbers = new ArrayList<>();
        for (int i = min; i <= max; i++) {
            numbers.add(i);
        }
        Collections.shuffle(numbers);
        for (int row = 0; row < 5; row++) {
            grid[row][col] = numbers.get(row);
        }
    }

    public int[][] getGrid() {
        return grid;
    }
}