<template>
  <div id="app">
<!--     <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/> -->

    <el-container>
      <el-aside class="asideclass" width="200px">
        <el-menu class="elmenuclass" :default-openeds="['1']">
          <el-menu-item index="1-1">
            <router-link 
              to="/">
              <i class="el-icon-user"></i>Clientes
            </router-link>
          </el-menu-item>

          <el-submenu index="2">
            <template slot="title"><i class="el-icon-s-order"></i>Reportes</template>
            <el-menu-item index="2-1">
              <router-link 
                to="/tiendas">Tiendas
              </router-link>
            </el-menu-item>
            <el-menu-item index="2-2">
              Autos
            </el-menu-item>
          </el-submenu>
          </el-menu>
      </el-aside>
      <el-container>
        <!-- <el-header>Cabecera</el-header> -->
        <el-main class="mainclass">
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

ul.elmenuclass.el-menu{
  height: 100vh;
}
.asideclass{
  background-color: red;
  // ul{
  //   height: 100vh;
  // }
}

.mainclass{
  height: 100vh;
}

</style>
