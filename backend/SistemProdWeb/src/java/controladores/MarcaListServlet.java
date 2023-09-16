/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controladores;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/marca-list")
public class MarcaListServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html;charset=UTF-8");
        
        try (PrintWriter out = response.getWriter()) {
            // Configuración de la conexión a la base de datos
            String url = "jdbc:mysql://localhost:3306/bdreencauche";
            String usuario = "pruebas";
            String contraseña = "123";
            
            // Inicialización de la conexión
            try {
                Class.forName("com.mysql.cj.jdbc.Driver");
                Connection conexion = DriverManager.getConnection(url, usuario, contraseña);

                // Consulta SQL para listar marcas
                String consulta = "SELECT * FROM marcas";
                Statement statement = conexion.createStatement();
                ResultSet rs = statement.executeQuery(consulta);

                // Generar la respuesta HTML con los resultados de la consulta
                out.println("<html>");
                out.println("<head>");
                out.println("<title>Listado de Marcas</title>");
                out.println("</head>");
                out.println("<body>");
                out.println("<h1>Listado de Marcas</h1>");
                out.println("<table>");
                out.println("<tr><th>ID</th><th>Marca</th></tr>");
                
                while (rs.next()) {
                    int id = rs.getInt("id_marca");
                    String marca = rs.getString("marca");
                    out.println("<tr><td>" + id + "</td><td>" + marca + "</td></tr>");
                }
                
                out.println("</table>");
                out.println("</body>");
                out.println("</html>");
                
                // Cerrar la conexión
                conexion.close();
            } catch (ClassNotFoundException | SQLException e) {
                out.println("Error: " + e.getMessage());
            }
        }
    }
}
