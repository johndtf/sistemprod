/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Main.java to edit this template
 */
package sistemprod.backend;

/**
 *
 * @author i7 Decima Generacion
 */

import java.sql.*;
public class SistemprodBackend {

    /**
     * @param args the command line arguments
     */
public static void main(String[] args) {
    String url = "jdbc:mysql://localhost:3306/bdreencauche";
    String usuario = "pruebas";
    String contraseña = "123";

    DatabaseOperations dbOps = new DatabaseOperations(url, usuario, contraseña);

    // Llamar al método insertarMarca para crear una nueva marca
    //dbOps.insertarMarca("NUEVAMARCA");
    
    //Método para Modificar una marca
    //dbOps.actualizarNombreMarca(6, "MODIFICADA");
    
    // Método para borrar marca por id
    dbOps.borrarMarcaPorId(6);
    
    //Consultar todas las marcas
    dbOps.consultarTodasLasMarcas();

    // Cerrar la conexión cuando hayas terminado
    dbOps.cerrarConexion();
}

}
