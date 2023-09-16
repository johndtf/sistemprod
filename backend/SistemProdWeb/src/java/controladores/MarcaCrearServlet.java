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
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/marca-crear")
public class MarcaCrearServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        
        try (PrintWriter out = response.getWriter()) {
            // Parámetros enviados desde el formulario HTML
            String nuevaMarca = request.getParameter("nuevaMarca");

            // Configuración de la conexión a la base de datos
            String url = "jdbc:mysql://localhost:3306/bdreencauche";
            String usuario = "root";
            String contraseña = "Superadmin-2023";
            
            try {
                Class.forName("com.mysql.cj.jdbc.Driver");
                Connection conexion = DriverManager.getConnection(url, usuario, contraseña);

                // Sentencia SQL para insertar una nueva marca
                String sql = "INSERT INTO marcas (marca) VALUES (?)";
                PreparedStatement preparedStatement = conexion.prepareStatement(sql);
                preparedStatement.setString(1, nuevaMarca);

                // Ejecutar la inserción
                int filasAfectadas = preparedStatement.executeUpdate();

                if (filasAfectadas > 0) {
                    // Inserción exitosa
                    out.println("Marca creada exitosamente.");
                } else {
                    // Algo salió mal
                    out.println("No se pudo crear la marca.");
                }

                // Cerrar la conexión
                conexion.close();
            } catch (ClassNotFoundException | SQLException e) {
                out.println("Error: " + e.getMessage());
            }
        }
    }
}
