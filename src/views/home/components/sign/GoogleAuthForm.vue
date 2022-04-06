<script setup lang="ts">
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { auth } from "@/firebase/auth";

const fbUI = new firebaseui.auth.AuthUI(auth);
console.log("🚀 ~ file: GoogleAuthForm.vue ~ line 8 ~ fbUI", fbUI);
</script>

<template>
  <div>Text</div>
</template>
