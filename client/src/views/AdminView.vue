<template>
  <div class="container">
    <h1 class="title">Admin Area</h1>
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>John Doe</td>
          <td>john.doe@example.com</td>
          <td>Admin</td>
          <td>
            <button class="button is-small is-info">Edit</button>
            <button class="button is-small is-danger">Delete</button>
          </td>
        </tr>
        <tr>
          <td>2</td>
          <td>Jane Smith</td>
          <td>jane.smith@example.com</td>
          <td>User</td>
          <td>
            <button class="button is-small is-info">Edit</button>
            <button class="button is-small is-danger">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <button class="button is-primary">Add User</button>
  </div>
</template>

<script setup lang="ts">

</script>
