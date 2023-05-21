import { gql, useQuery } from "@apollo/client";
import ClientRow from "./ClientRow";
import { GET_CLIENTS } from "./CLientQueries";
import Spinner from "./Spinner";

export default function Clients() {
  const { data, loading, error } = useQuery(GET_CLIENTS);

  if (loading) return <Spinner />;
  if (data && !error)
    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th className="col">Name</th>
            <th className="col">Email</th>
            <th className="col">Phone</th>
          </tr>
        </thead>
        <tbody>
          {data.clients.map((client) => {
            return <ClientRow key={client.id} client={client} />;
          })}
        </tbody>
      </table>
    );
}
