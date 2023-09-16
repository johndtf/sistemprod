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

@WebServlet("/marca-eliminar")
public class MarcaEliminarServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/plain");
        PrintWriter out = response.getWriter();

        // Recupera el parámetro "idMarca" de la solicitud
        int idMarca = Integer.parseInt(request.getParameter("idMarca"));

        // Lógica para eliminar la marca de la base de datos
        boolean eliminacionExitosa = eliminarMarcaEnBaseDeDatos(idMarca);

        if (eliminacionExitosa) {
            out.print("eliminado");
        } else {
            out.print("Noeliminado");
        }
        out.flush();
    }

    private boolean eliminarMarcaEnBaseDeDatos(int idMarca) {
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            // Establece la conexión a la base de datos (ajusta esto según tu entorno)
            String dbURL = "jdbc:mysql://localhost:3306/bdreencauche";
            String dbUser = "pruebas";
            String dbPassword = "123";
            conn = DriverManager.getConnection(dbURL, dbUser, dbPassword);

            // Elimina la marca de la base de datos
            String sql = "DELETE FROM marcas WHERE id_marca = ?";
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, idMarca);
            int filasEliminadas = stmt.executeUpdate();

            // Si se eliminó al menos una fila, la eliminación fue exitosa
            return filasEliminadas > 0;
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
