<script setup lang="ts">
</script>

<template>
    <nav class="navbar is-info" role="navigation" aria-label="main navigation">
        <div class="container">
            <div class="navbar-brand">
                <a class="navbar-item" href="https://jewpaltz.com">
                    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="30" />
                </a>

                <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarBasicExample" class="navbar-menu">
                <div class="navbar-start">


                    <RouterLink to="/" class="navbar-item">Home</RouterLink>
                    <RouterLink to="/about" class="navbar-item">About</RouterLink>

                    <a class="navbar-item">
                        Documentation
                    </a>

                    <RouterLink to="/admin" class="navbar-item">Admin</RouterLink>
                    <RouterLink to="/activities" class="navbar-item">Activities</RouterLink>
                    <RouterLink to="/friends" class="navbar-item">Friends</RouterLink>
                </div>
                <div class="navbar-end">
                    <div class="navbar-item">
                        <div class="buttons">
                            <RouterLink to="/register" class="button is-primary">
                                <strong>Sign up</strong>
                            </RouterLink>
                            <RouterLink to="/login" class="button is-light">
                                Log in
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<style scoped></style>
