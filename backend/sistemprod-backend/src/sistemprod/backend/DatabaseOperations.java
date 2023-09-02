/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package sistemprod.backend;

/**
 *
 * @author i7 Decima Generacion
 */
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class DatabaseOperations {
    private Connection conexion;

    public DatabaseOperations(String url, String usuario, String contraseña) {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conexion = DriverManager.getConnection(url, usuario, contraseña);
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        }
    }
//Metodo para insertar una nueva marca
    public void insertarMarca(String nombreMarca) {
        try {
            String consulta = "INSERT INTO marcas (marca) VALUES (?)";
            PreparedStatement pstmt = conexion.prepareStatement(consulta);
            pstmt.setString(1, nombreMarca);
            pstmt.executeUpdate();
            pstmt.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // Metodo para borrar una marca mediante el id
    public void borrarMarcaPorId(int id) {
    try {
        String consulta = "DELETE FROM marcas WHERE id_marca = ?";
        PreparedStatement pstmt = conexion.prepareStatement(consulta);
        pstmt.setInt(1, id);
        pstmt.executeUpdate();
        pstmt.close();
    } catch (SQLException e) {
        e.printStackTrace();
    }
}
    

    
    //Metodo para actualizar el nombre de la marca mediante su id
    public void actualizarNombreMarca(int id, String nuevoNombre) {
    try {
        String consulta = "UPDATE marcas SET marca = ? WHERE id_marca = ?";
        PreparedStatement pstmt = conexion.prepareStatement(consulta);
        pstmt.setString(1, nuevoNombre);
        pstmt.setInt(2, id);
        pstmt.executeUpdate();
        pstmt.close();
    } catch (SQLException e) {
        e.printStackTrace();
    }
}

//Metodo para consultar todas las marcas
    
    public void consultarTodasLasMarcas() {
    try {
        String consulta = "SELECT * FROM marcas";
        Statement statement = conexion.createStatement();
        ResultSet rs = statement.executeQuery(consulta);

        while (rs.next()) {
            int id = rs.getInt("id_marca");
            String nombre = rs.getString("marca");
            System.out.println("ID: " + id + ", Nombre: " + nombre);
        }

        rs.close();
        statement.close();
    } catch (SQLException e) {
        e.printStackTrace();
    }
}

        //metodo para cerrar la conexión
    public void cerrarConexion() {
    try {
        if (conexion != null) {
            conexion.close();
        }
    } catch (SQLException e) {
        e.printStackTrace();
    }
}
}
