<template>
  <Toast />
  <div
    class="create-user-form p-8 border rounded-lg shadow-lg max-w-xl mx-auto bg-white"
  >
    <h2 class="text-2xl font-bold mb-6">Créer un Nouvel Utilisateur</h2>
    <form @submit.prevent="createUser">
      <div class="flex flex-col md:flex-row gap-4 mb-4">
        <div class="w-full md:w-1/2">
          <label for="nom" class="block mb-2 text-lg font-medium text-gray-700"
            >Nom</label
          >
          <InputText
            type="text"
            id="nom"
            v-model="user.nom"
            required
            class="w-full p-3 border rounded focus:ring focus:ring-indigo-200"
          />
        </div>
        <div class="w-full md:w-1/2">
          <label
            for="prenom"
            class="block mb-2 text-lg font-medium text-gray-700"
            >Prénom</label
          >
          <InputText
            type="text"
            id="prenom"
            v-model="user.prenom"
            required
            class="w-full p-3 border rounded focus:ring focus:ring-indigo-200"
          />
        </div>
      </div>
      <div class="mb-4">
        <label for="email" class="block mb-2 text-lg font-medium text-gray-700"
          >Email</label
        >
        <InputText
          type="email"
          id="email"
          v-model="user.email"
          placeholder="exemple@exemple.fr"
          required
          class="w-full p-3 border rounded focus:ring focus:ring-indigo-200"
        />
      </div>
      <div class="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            for="date_de_naissance"
            class="block mb-2 text-lg font-medium text-gray-700"
            >Date de naissance</label
          >
          <InputText
            type="date"
            id="date_de_naissance"
            v-model="user.date_de_naissance"
            required
            class="w-full p-3 border rounded focus:ring focus:ring-indigo-200"
          />
        </div>
        <div>
          <label class="block mb-2 text-lg font-medium text-gray-700"
            >Genre</label
          >
          <div class="flex items-center gap-4">
            <div class="flex items-center">
              <RadioButton
                inputId="genre-m"
                v-model="user.genre"
                :value="'M'"
                class="mr-2"
              />
              <label for="genre-m" class="font-semibold text-lg"
                ><i class="pi pi-mars mr-1"></i>Masculin</label
              >
            </div>
            <div class="flex items-center">
              <RadioButton
                inputId="genre-f"
                v-model="user.genre"
                :value="'F'"
                class="mr-2"
              />
              <label for="genre-f" class="font-semibold text-lg"
                ><i class="pi pi-venus mr-1"></i>Féminin</label
              >
            </div>
          </div>
        </div>
      </div>
      <div class="mb-4">
        <label for="role" class="block mb-2 text-lg font-medium text-gray-700"
          >Rôle</label
        >
        <Select
          id="role"
          v-model="user.role"
          :options="roles"
          optionLabel="label"
          optionValue="value"
          class="w-full border rounded focus:ring"
        />
      </div>
      <Button
        type="submit"
        label="Enregistrer"
        icon="pi pi-check"
        :loading="loading"
        class="w-full py-3 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700"
      />
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import RadioButton from "primevue/radiobutton";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

const user = ref({
  nom: "",
  prenom: "",
  email: "",
  genre: "M",
  role: "joueur",
  date_de_naissance: "",
});

const roles = ref([
  { label: "Joueur", value: "joueur" },
  { label: "Admin", value: "admin" },
  { label: "Organisateur", value: "organisateur" },
]);

const loading = ref(false);

const generatePassword = () => {
  const length = 12;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";

  const hasNumber = () => /\d/.test(password);
  const hasUppercase = () => /[A-Z]/.test(password);
  const hasSpecialChar = () =>
    /[!@#$%^&*()_+~`|}{[\]:;?><,./-=]/.test(password);

  while (
    password.length < length ||
    !hasNumber() ||
    !hasUppercase() ||
    !hasSpecialChar()
  ) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
};

const toast = useToast();

const createUser = async () => {
  const password = generatePassword();
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/api/users/create-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...user.value,
          password,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Erreur lors de la création de l'utilisateur");
    }
    const data = await response.json();
    // await fetch(`${import.meta.env.VITE_APP_API_URL}/api/send-email`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     to: user.value.email,
    //     subject: "Votre compte a été créé",
    //     text: `Bonjour ${user.value.prenom},\n\nVotre compte a été créé avec succès. Voici votre mot de passe : ${password}\n\nVeuillez le changer après votre première connexion.\n\nCordialement,\nL'équipe.`,
    //   }),
    // });
    toast.add({
      severity: "success",
      summary: "Succès",
      detail: "Utilisateur créé avec succès et email envoyé.",
      life: 3000,
    });
    resetForm();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Erreur",
      detail: error.message,
      life: 3000,
    });
  }
};

const resetForm = () => {
  user.value = {
    nom: "",
    prenom: "",
    email: "",
    genre: "M",
    role: "joueur",
    date_de_naissance: "",
  };
};
</script>

<style scoped>
.create-user-form {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  width: 100%;
  max-width: 600px;
}
</style>
