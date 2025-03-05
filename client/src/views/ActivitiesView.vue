<template>
  <div class="container">
    <h1 class="title">Activities</h1>
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Date</th>
          <th>Duration</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Running</td>
          <td>2024-01-01</td>
          <td>30 minutes</td>
          <td>
            <button class="button is-small is-info">Edit</button>
            <button class="button is-small is-danger">Delete</button>
          </td>
        </tr>
        <tr>
          <td>2</td>
          <td>Swimming</td>
          <td>2024-01-02</td>
          <td>45 minutes</td>
          <td>
            <button class="button is-small is-info">Edit</button>
            <button class="button is-small is-danger">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <button class="button is-primary">Add Activity</button>
  </div>
</template>

<script setup lang="ts">

</script>
