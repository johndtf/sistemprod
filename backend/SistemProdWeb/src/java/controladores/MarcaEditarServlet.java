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

@WebServlet("/marca-actualizar")
public class MarcaEditarServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/plain");
        PrintWriter out = response.getWriter();

        // Recupera los parámetros "idMarca" y "nuevaDescripcion" de la solicitud
        int idMarca = Integer.parseInt(request.getParameter("idMarca"));
        String nuevaDescripcion = request.getParameter("nuevaDescripcion");
        
        //mostrar información recibida en consola
        System.out.println("IdMarca recibido: " + idMarca);
        System.out.println("Nombre de Marca Recibido: " + nuevaDescripcion);

        // Lógica para actualizar la descripción de la marca en la base de datos
        boolean actualizacionExitosa = actualizarDescripcionEnBaseDeDatos(idMarca, nuevaDescripcion);

        if (actualizacionExitosa) {
            out.print("actualizado");
        } else {
            out.print("Noactualizado");
        }
        out.flush();
    }

    private boolean actualizarDescripcionEnBaseDeDatos(int idMarca, String nuevaDescripcion) {
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            // Establece la conexión a la base de datos (debes configurar esto según tu entorno)
            String dbURL = "jdbc:mysql://localhost:3306/bdreencauche";
            String dbUser = "pruebas";
            String dbPassword = "123";
            conn = DriverManager.getConnection(dbURL, dbUser, dbPassword);

            // Actualiza la descripción de la marca en la base de datos
            String sql = "UPDATE marcas SET marca = ? WHERE id_marca = ?";
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, nuevaDescripcion);
            stmt.setInt(2, idMarca);
            int filasActualizadas = stmt.executeUpdate();

            // Si se actualizó al menos una fila, la actualización fue exitosa
            return filasActualizadas > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        } finally {
            // Cierra las conexiones y recursos
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
