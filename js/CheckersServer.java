import java.io.*;
import java.net.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class CheckersServer
{	
	public static void main(String args[]) throws Exception
	{
		ServerSocket server = new ServerSocket(9876);
		while(true)
		{
			Socket client = server.accept();
			
			RequestHandler rh = new RequestHandler(client);
			rh.start();
		}
	}
}


class RequestHandler extends Thread
{
	private Socket clientSocket = null;
	
	public RequestHandler(Socket _clientSocket)
	{
		clientSocket = _clientSocket;
	}
	
	public void run()
	{
		try{
			
			ObjectOutputStream out = new ObjectOutputStream(clientSocket.getOutputStream());
			ObjectInputStream in = new  ObjectInputStream(clientSocket.getInputStream());
			
			//From output, get String
			String initString = (String) in.readObject();
			
			switch(initString)
			{
			case "0000": // Add new board
				//Create new entry in db and get key
				String s = CheckersDatabase.addNew();
				//write new key out to client
				out.writeObject(s);
				break;
			default:
				//Lookup initString
				Board b = CheckersDatabase.get(initString);
				// write out the corresponding board
				out.writeObject(b);
			}
			
			out.close();
			in.close();
			clientSocket.close();
		}catch(IOException e){e.printStackTrace();} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}

class Board
{

}

class CheckersDatabase
{
	private static HashMap<String, Board> database = new HashMap<String, Board>();
	
	public static void update(String s, Board b)
	{
		database.put(s,  b);
	}
	
	public static String addNew()
	{
		String s = newKey();
		
		database.put(s, new Board());
		
		return s;
	}
	
	public static Board get(String s)
	{
		return database.get(s);
	}
	
	public static void remove(String s)
	{
		database.remove(s);
	}
	
	public static int size()
	{
		return database.size();
	}
	
	private static String newKey()
	{
		String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		String key = "";
		
		do
		{
			//Generate a key
			int[] ints = {(int) (Math.random()*chars.length()), (int) (Math.random()*chars.length()), (int) (Math.random()*chars.length()), (int) (Math.random()*chars.length())};
			key =  
					chars.substring(ints[0], ints[0]+1) + 
					chars.substring(ints[1], ints[1]+1) + 
					chars.substring(ints[2], ints[2]+1) + 
					chars.substring(ints[3], ints[3]+1);
			
			
		}while(database.containsKey(key) || key.equals("0000")); // check if the key is already in use or if it't a special case.
		
		return key;
	}
}
