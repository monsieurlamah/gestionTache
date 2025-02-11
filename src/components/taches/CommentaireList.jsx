import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Trash2, Plus, X } from "lucide-react";
import { toast } from "react-toastify";


const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const CommentaireTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [comment, setComment] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newComment, setNewComment] = useState({
    content: "",
	point_de_blocage:"",
	proposition:"",
	semaine:"",
  });
  const [semaine, setSemaine] = useState([]);


  useEffect(() => {
	fetch("http://127.0.0.1:8000/api/v1/semaines/")  
	  .then((response) => response.json())
	  .then((data) => setSemaine(data))
	  .catch((error) => console.error("Erreur lors du chargement des semaines :", error));
  }, []);
console.log(semaine);


  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/v1/commentaires/")
      .then((response) => response.json())
      .then((data) => setComment(data))
      .catch((error) => console.error("Erreur lors du chargement des commentaires :", error));
  }, []);

  const filteredComment = comment.filter(
    (comment) =>
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (comment.content && comment.content?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewComment((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newComment.content || !newComment.point_de_blocage || !newComment.proposition || !newComment.semaine) {
      toast.error("Tous les champs doivent être remplis !");
      return;
    }

    console.log("Données envoyées :", newComment);

    fetch("http://127.0.0.1:8000/api/v1/commentaires/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newComment),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(err => { throw err; });
        }
        return response.json();
      })
      .then((data) => {
        toast.success("Commentaire ajouté avec succès !");
        setTasks((prevTasks) => [...prevTasks, data]); 
        setIsModalOpen(false);
        setNewComment({
            content: "",
            point_de_blocage:"",
            proposition:"",
            semaine:"",

        });
      })
      .catch((error) => {
        toast.error("Erreur lors de l'ajout du commentaire");
        console.error("Erreur de l'API :", error);
      });
};


  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md w-full shadow-lg rounded-xl p-4 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4 sm:mb-0">Liste des commentaires</h2>
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Rechercher un commentaire..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <Search className="absolute left-1 top-2.5 text-gray-400" size={18} />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Ajouter un  commentaire
        </button>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Commentaire</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Point de bloquage</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Proposition</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Semaine</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredComment.map((comment) => (
              <motion.tr key={comment.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-100">{comment.content}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">{comment.point_de_blocage}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">{comment.proposition}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">{comment.periode}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300 flex items-center space-x-2">
                  <button className="text-yellow-500 hover:text-yellow-400">
                    <Edit size={18} />
                  </button>
                  <button className="text-red-500 hover:text-red-400">
                    <Trash2 size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-100">Ajouter un commentaire</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Commentaire</label>
                  <input
                    type="text"
                    name="content"
                    value={newComment.content}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white p-2 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Point de blocage</label>
                  <input
                    type="text"
                    name="point_de_blocage"
                    value={newComment.point_de_blocage}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white p-2 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Proposition</label>
                  <input
                    type="text"
                    name="proposition"
                    value={newComment.proposition}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white p-2 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Semaine</label>
                  <select
                    name="semaine"
                    value={newComment.semaine}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white p-2 rounded-md"
                    required
                  >
                    <option value="">Choisir une semaine</option>
                    {semaine.map((sem) => (
                      <option key={sem.id} value={sem.id}>{sem.periode}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500">
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </motion.div>
  );
};

export default CommentaireTable;
