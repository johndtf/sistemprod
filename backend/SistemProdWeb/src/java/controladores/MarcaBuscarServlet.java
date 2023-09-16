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

@WebServlet("/marca-buscar")
public class MarcaBuscarServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");

        // Obtener el nombre de la marca enviado desde el frontend
        String nombreMarca = request.getParameter("nombreMarca");       
    
    
    // Imprimir el nombre de la marca en la consola del servidor
    //System.out.println("Nombre de Marca recibido: " + nombreMarca);

        try (PrintWriter out = response.getWriter()) {
            MarcaInfo marcaInfo = buscarMarca(nombreMarca);

            if (marcaInfo != null) {
                // Convertir la información de la marca a JSON y enviarla al frontend
                String jsonResponse = "{\"id\":\"" + marcaInfo.getId() + "\",\"marca\":\"" + marcaInfo.getMarca() + "\"}";
                out.print(jsonResponse);
            } else {
                // Si no se encuentra la marca, responder con JSON vacío o un mensaje de error
                out.print("{}");
            }
        }
    }

    private MarcaInfo buscarMarca(String nombreMarca) {
        // Configuración de la conexión a la base de datos (ajusta los valores según tu configuración)
        String url = "jdbc:mysql://localhost:3306/bdreencauche";
        String usuario = "root";
        String contraseña = "Superadmin-2023";

        try {
            // Establecer la conexión con la base de datos
            Connection connection = DriverManager.getConnection(url, usuario, contraseña);

            // Consulta SQL para buscar la marca por nombre
            String sql = "SELECT id_marca, marca FROM marcas WHERE marca = ?";
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setString(1, nombreMarca);

            // Ejecutar la consulta
            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                int id = resultSet.getInt("id_marca");
                String marca = resultSet.getString("marca");
                return new MarcaInfo(id, marca);
            }

            resultSet.close();
            statement.close();
            connection.close();
        } catch (SQLException e) {
            e.printStackTrace(); // Agregar esto para ver errores en la consola
        }

        return null;
    }

    // Clase para almacenar la información de la marca
    private class MarcaInfo {
        private int id;
        private String marca;

        public MarcaInfo(int id, String marca) {
            this.id = id;
            this.marca = marca;
        }

        public int getId() {
            return id;
        }

        public String getMarca() {
            return marca;
        }
    }
}
