import { FaTrash } from "react-icons/fa";
import { DELETE_CLIENT } from "./ClientMutations";
import { useMutation } from "@apollo/client";
import { GET_CLIENTS } from "./CLientQueries";
export default function ClientRow({ client: { name, email, phone, id } }) {
  const [mutateFunction, { data, loading, error }] = useMutation(
    DELETE_CLIENT,
    {
      variables: {
        id,
      },
      //   refetchQueries: [GET_CLIENTS], //first approach => refetch relevant query

      //better approch ==> update relevant cache
      update: (cache, { data: { deleteClient } }) => {
        const { clients } = cache.readQuery({ query: GET_CLIENTS });
        cache.writeQuery({
          query: GET_CLIENTS,
          data: {
            clients: clients.filter((client) => client.id !== deleteClient.id),
          },
        });
      },
    }
  );
  return (
    <tr>
      <td>{name}</td>
      <td>{email}</td>
      <td>{phone}</td>
      <td>
        <button className="btn btn-danger btn-sm" onClick={mutateFunction}>
          <FaTrash />
        </button>
      </td>
    </tr>
  );
}
