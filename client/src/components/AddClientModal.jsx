import { FaUser } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { ADD_CLIENT } from "./ClientMutations";
import { GET_CLIENTS } from "./CLientQueries";
import { useMutation } from "@apollo/client";

export default function AddClientModal() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [addFunction, { error, loading, client }] = useMutation(ADD_CLIENT, {
    // refetchQueries: [GET_CLIENTS],
    update(cache, { data: { addClient } }) {
      const { clients } = cache.readQuery({ query: GET_CLIENTS });
      cache.writeQuery({
        query: GET_CLIENTS,
        data: {
          clients: clients.concat([addClient]),
        },
      });
    },
  });

  const onSubmit = (data) => {
    addFunction({
      variables: { name: data.name, email: data.email, phone: data.phone },
    });
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        <div className="d-flex justify-content-center align-items-center">
          <FaUser />
          Launch demo modal
        </div>
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Add Client
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3 d-flex flex-column">
                <label htmlFor="name" className="form-label text-start ms-1">
                  Name
                </label>
                <input
                  required
                  id="name"
                  className="form-control"
                  defaultValue=""
                  {...register("name")}
                />
              </div>
              <div className="mb-3 d-flex flex-column">
                <label htmlFor="email" className="form-label text-start ms-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="form-control"
                  defaultValue=""
                  {...register("email")}
                />
              </div>
              <div className="mb-3 d-flex flex-column">
                <label htmlFor="phone" className="form-label text-start ms-1">
                  Phone
                </label>
                <input
                  id="phone"
                  required
                  className="form-control"
                  defaultValue=""
                  {...register("phone")}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-bs">
                Add new Client
              </button>
            </form>
            <div className="modal-footer"></div>
          </div>
        </div>
      </div>
    </>
  );
}
