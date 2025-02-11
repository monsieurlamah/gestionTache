import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Trash2, Plus } from "lucide-react";
import { toast } from "react-toastify";


// Dictionnaires pour les valeurs lisibles
const CELLULE_LABELS = {
  cellule_partenariat: "Cellule Partenariat",
  cellule_etude_marche: "Cellule Etude et Marché",
  cellule_evenementiel: "Cellule Evenementiel",
  cellule_etude_analyse_donnee: "Cellule Etudes et Analyses des Données",
  cellule_documentation_archive: "Cellule Documentation et Archives",
  cellule_certification: "Cellule Certification",
  cellule_reglementation: "Cellule Reglementation",
  agent_comptable: "Agent Comptable",
  service_rh: "Service des ressources humaines",
  service_logistique: "Service Logistique",
  service_com_rp: "Service Communication et Relations Publiques",
  secretariat_central: "Secrétariat Central",
  controlleur_financier: "Contrôleur Financier",
  autre: "Autre",
};

const DEPARTEMENT_LABELS = {
  certification_reglementation: "Certification et Réglementation",
  marketing: "Marketing",
  statistique_documentation: "Statistique et Documentation",
  autre: "Autre",
};

const GRADE_LABELS = {
	chef_cellule: "Chef Cellule",
	chef_service: "Chef service",
	autre: "Autre",
  };

const POURCENTAGE_LABELS = {
  debut: "Début (0%)",
  commencer: "Commencer (20%)",
  encours: "Encours (50%)",
  terminer: "Terminer (100%)",
};

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

const TasksTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    titre: "",
    date_debut: "",
    date_fin: "",
    semaine: "",
    cellule: "",
    departement: "",
    employer: "",
    pourcentage: "",
	grade:"",
	point_de_blocage:"",
	detail:"",
  });
  const [employees, setEmployees] = useState([]);
  const [semaine, setSemaine] = useState([]);

  useEffect(() => {
	fetch("http://127.0.0.1:8000/api/v1/employers/")  
	  .then((response) => response.json())
	  .then((data) => setEmployees(data))
	  .catch((error) => console.error("Erreur lors du chargement des employés :", error));
  }, []);


  useEffect(() => {
	fetch("http://127.0.0.1:8000/api/v1/semaines/")  
	  .then((response) => response.json())
	  .then((data) => setSemaine(data))
	  .catch((error) => console.error("Erreur lors du chargement des semaines :", error));
  }, []);
console.log(semaine);


  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/v1/taches/")
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Erreur lors du chargement des tâches :", error));
  }, []);

  const filteredTasks = tasks.filter(
    (task) =>
      task.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.cellule && CELLULE_LABELS[task.cellule]?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newTask.titre || !newTask.date_debut || !newTask.date_fin || !newTask.cellule || !newTask.departement || !newTask.pourcentage) {
      toast.error("Tous les champs doivent être remplis !");
      return;
    }

    console.log("Données envoyées :", newTask);

    fetch("http://127.0.0.1:8000/api/v1/taches/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(err => { throw err; });
        }
        return response.json();
      })
      .then((data) => {
        toast.success("Tâche ajoutée avec succès !");
        setTasks((prevTasks) => [...prevTasks, data]); 
        setIsModalOpen(false);
        setNewTask({
          titre: "",
          date_debut: "",
          date_fin: "",
          cellule: "",
          departement: "",
          employer: "",
          pourcentage: "",
		  point_de_blocage:"",
		  grade:"",
		  detail:"",

        });
      })
      .catch((error) => {
        toast.error("Erreur lors de l'ajout de la tâche");
        console.error("Erreur de l'API :", error);
      });
};


  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-4 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4 sm:mb-0">Liste des tâches</h2>
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Rechercher une tâche..."
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
          Ajouter une tâche
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Titre</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Début</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Fin</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Cellule</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Département</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Employé</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Progression</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredTasks.map((task) => (
              <motion.tr key={task.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-100">{task.titre}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">{formatDate(task.date_debut)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">{formatDate(task.date_fin)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">{CELLULE_LABELS[task.cellule] || "Inconnu"}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">{DEPARTEMENT_LABELS[task.departement] || "Inconnu"}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">{task.employer ? task.employer_full_name : "Aucun employé"}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">{POURCENTAGE_LABELS[task.pourcentage] || "Non défini"}</td>
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
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-4xl w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-100 mb-4">Ajouter une tâche</h3>
        <button
          onClick={() => setIsModalOpen(false)}
          className="top-2 right-2 text-gray-400 hover:text-gray-300"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Titre</label>
            <input
              type="text"
              name="titre"
              value={newTask.titre}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white p-2 rounded-md"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Date de début</label>
              <input
                type="date"
                name="date_debut"
                value={newTask.date_debut}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Date de fin</label>
              <input
                type="date"
                name="date_fin"
                value={newTask.date_fin}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Grade</label>
              <select
                name="grade"
                value={newTask.grade}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
                required
              >
                <option value="">Choisir un grade</option>
                {Object.entries(GRADE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Cellule</label>
              <select
                name="cellule"
                value={newTask.cellule}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
                required
              >
                <option value="">Choisir une cellule</option>
                {Object.entries(CELLULE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Département</label>
              <select
                name="departement"
                value={newTask.departement}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
                required
              >
                <option value="">Choisir un département</option>
                {Object.entries(DEPARTEMENT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-gray-300 text-sm">Employé :</label>
              <select
                name="employer"
                value={newTask.employer}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white rounded-lg p-2 focus:ring focus:ring-blue-500"
              >
                <option value="">Sélectionner un employé</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-gray-300 text-sm">Semaine :</label>
              <select
                name="semaine"
                value={newTask.semaine}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white rounded-lg p-2 focus:ring focus:ring-blue-500"
              >
                <option value="">Sélectionner une semaine</option>
                {semaine.map((sem) => (
                  <option key={sem.id} value={sem.id}>
                    {sem.periode}
                  </option>
                ))}
              </select>
            </div>

			<div>
              <label className="text-gray-300 text-sm">Point de blocage :</label>
              <input
                type="texte"
                name="point_de_blocage"
                value={newTask.point_de_blocage}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Progression</label>
            <select
              name="pourcentage"
              value={newTask.pourcentage}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white p-2 rounded-md"
              required
            >
              <option value="">Choisir la progression</option>
              {Object.entries(POURCENTAGE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Détail</label>
            <textarea
              name="detail"
              value={newTask.detail}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white p-2 rounded-md"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg mt-4"
          >
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

export default TasksTable;
