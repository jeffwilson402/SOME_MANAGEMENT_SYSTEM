import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const useModal = () => {
  const myModal = ({
    title = "Are you sure?",
    text = "This is Text",
    icon = "question",
    showCancelButton = true,
    confirmButtonText = "Confirm",
    cancelButtonText = "Cancel"
  }) => {
    return MySwal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: showCancelButton,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      confirmButtonColor: "#f6a117",
      cancelButtonColor: "#999",
    });
  };

  return { myModal };
};

export default useModal;
