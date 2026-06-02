import { useState, useRef, useEffect } from "react";
import { MoreVertical, Pencil, Mail, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ActionMenu = ({ order, options = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleEdit = () => {
    const orderId = order.id ;

    if (!orderId) {
      console.error("Order ID not found in order:", order);
      return;
    }

    navigate(`/admin/orders/edit/${orderId}`);
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleViewDetails = () => {
    navigate(`/admin/orders/${order.orderId}`);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <MoreVertical size={14} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
          {options.viewDetails && (
            <button
              onClick={handleViewDetails}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Eye size={16} /> View Details
            </button>
          )}
          {options.editOrder && (
            <button
              onClick={() => {
                const orderId = order.id || order.orderId;

                if (!orderId) {
                  console.error("Order ID not found in order:", order);
                  return;
                }

                setIsOpen(false);
                navigate(`/admin/orders/edit/${orderId}`);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Pencil size={16} /> Edit Order
            </button>
          )}
          {options.sendEmail && (
            <button
              onClick={() => {
                console.log("Send Email", order);
                setIsOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Mail size={16} /> Send Email
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
