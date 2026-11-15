import java.util.Scanner;

public class Solution {

    private static final int N_TC = 10;

    private static Scanner scanner = new Scanner(System.in);

    private static int computeOneTc(int base, int exponent) {
        if (exponent == 0) return 1;
        if (exponent == 1) return base;

        return computeOneTc(base, exponent / 2) * computeOneTc(base, exponent - exponent / 2);
    }

    public static void main(String[] args) {

        for (int i = 0; i < N_TC; i++) {
            int tcIdx = scanner.nextInt();
            int base = scanner.nextInt();
            int exponent = scanner.nextInt();

            int answer = computeOneTc(base, exponent);
            System.out.println("#" + tcIdx + " " + answer);
        }
    }
}