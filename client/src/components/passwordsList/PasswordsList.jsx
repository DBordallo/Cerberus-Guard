import React, { useState, useEffect } from "react";
import "./PasswordList.css";
import Pagination from "../pagination/Pagination";
import { useAuth } from "../../authcontext/AuthContext";

const PasswordList = () => {
  const { isUserAdmin } = useAuth();
  const [userData, setUserData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [userAccounts, setUserAccounts] = useState([]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const result = await isUserAdmin();

        if (result) {
          setUserData(result);
          const appsResponse = await fetch(
            `http://localhost:6700/cerberus/accounts/acc/${result.user.id}`
          );
          if (appsResponse.ok) {
            const accountsData = await appsResponse.json();
            setUserAccounts(accountsData);
          } else {
            console.error(
              'Error al obtener la cantidad de aplicaciones del usuario'
            );
          }
        } else {
          console.error('Error al obtener los datos de usuario');
        }
      } catch (error) {
        console.error('Error al recibir los datos del usuario', error);
      }
    };

    getUserData();
  }, [isUserAdmin]);

  if (!userData) {
    return null;
  }

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return userAccounts.slice(startIndex, endIndex);
  };

  return (
    <div className="containerList">
      <h2>My Passwords</h2>
      {userAccounts.length === 0 ? (
        <p>No tienes cuentas asignadas. Registra cuentas para verlas aquí.</p>
      ) : (
        <>
          <ul className="listPass">
            {getCurrentPageData().map((account) => (
              <li key={account.id} className="PassItems">
                <div className="PassInfo">
                  <img
                    src={account.image}
                    alt={`Imagen de ${account.title}`}
                    style={{ width: "3rem", maxWidth: "100px" }}
                  />
                  <div className="insideList">
                    <h3 className="titlePasslist">{account.title}</h3>
                    <p className="namePasslist">{account.name}</p>
                    <p className="emailPasslist">{account.email}</p>
                  </div>
                  <button className="Btn-more">.<br />.<br />.</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="pagination">
            <Pagination
              totalItems={userAccounts.length}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PasswordList;
