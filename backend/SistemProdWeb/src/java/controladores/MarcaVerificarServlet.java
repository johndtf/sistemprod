/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controladores;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/marca-verificar")
public class MarcaVerificarServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/plain;charset=UTF-8");
        
        String nombreMarca = request.getParameter("nombreMarca");
        //System.out.println("Nombre de Marca Recibido: " + nombreMarca);

        try (PrintWriter out = response.getWriter()) {
            boolean marcaExiste = verificarSiMarcaExiste(nombreMarca);
            
            if (marcaExiste) {
                out.print("existe");
            } else {
                out.print("noexiste");
            }
        }
    }

    private boolean verificarSiMarcaExiste(String nombreMarca) {
        // Configuración de la conexión a la base de datos (ajusta los valores según tu configuración)
        String url = "jdbc:mysql://localhost:3306/bdreencauche";
        String usuario = "pruebas";
        String contraseña = "123";

        try {
            // Establecer la conexión con la base de datos
            Connection connection = DriverManager.getConnection(url, usuario, contraseña);

            // Consulta SQL para verificar si la marca existe
            String sql = "SELECT COUNT(*) FROM marcas WHERE marca = ?";
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setString(1, nombreMarca);
                   
            // Ejecutar la consulta
            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                int count = resultSet.getInt(1);
                //System.out.println("Número de coincidencias encontradas: " + count);
                return count > 0;
            }

            resultSet.close();
            statement.close();
            connection.close();
        } catch (SQLException e) {
            e.printStackTrace(); // Agregar esto para ver errores en la consola
        }

        return false;
    }
}
