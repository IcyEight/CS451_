// Board class
//
// Basically just stores the board and whose turn it is. 
public class Board
{
    private int[][] board;
    private int player;
    // Constructors:
    public Board() //Leaving in the basic constructor, for now, just in case.
    {
        board = new int[8][8];
        player = 1;
        int i = 0;
        int j = 0;
        for (i=0; i<8; i++)
        {
            for (j=0; j<8; j++)
            {
                if (board[i][j]%0 == 0)
                {
                    board[i][j]= -1;
                }
                else if (i<3)
                {
                    board[i][j] = 1;
                }
                else if (i>=3 || i<5)
                {
                    board[i][j] = 0;
                }
                else
                {
                    board[i][j] = 2;
                }
            }
        }
    }
    public Board(int[][] b, int p)// ... this is the constructor that's more likely to be used, though.
    {
        board = b;
        player = p;
    }
    // Getters:
    public int[][] getBoard()
    {
        return board;
    }
    public int getPlayer()
    {
        return player;
    }
    // Setters:
    public void setBoard(int[][] b)
    {
        board = b;
    }
    public void setPlayer(int p)
    {
        player = p;
    }
}
