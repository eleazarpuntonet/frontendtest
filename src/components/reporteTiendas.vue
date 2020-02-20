<template>
  <el-container>
    <el-header style="text-align: right; font-size: 12px">
      <el-row>
        <el-col :span="12" class="greenButtons">
          <el-button 
            type      = "primary"
            size      = "small"
            @click    = "crearTienda()"
            round>Crear tienda</el-button>
          <el-button 
            @click    = "eliminarTienda()"
            size      = "small"
            :disabled = "selectionToggle"
            type      = "warning"
            round>Eliminar tienda
          </el-button>
        </el-col>
        <el-col :span="12" class="redButtons">
          <el-button 
            v-if = "selectionToggle && deleteItems.length > 0"
            @click = "confirmarDelete()"
            size   = "small"
            type   = "danger"
            round>Confirmar
            <span>{{ deleteItems.length }}</span>
          </el-button>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-table 
        height            = "500"
        ref               = "multipleTable"
        @selection-change = "selectionChange"
        :data             = "tableData">
        <template v-if    = "selectionToggle">
          <el-table-column
            type  = "selection"
            width = "55">
          </el-table-column>
        </template>
        <el-table-column 
            prop  = "storename"
            label = "Nombre">
        </el-table-column>
        <el-table-column 
            prop  = "address"
            label = "Apellido">
        </el-table-column>
        <el-table-column 
            prop  = "phone"
            label = "Email">
        </el-table-column>
        <el-table-column
            fixed = "right"
            label = "Operaciones"
            width = "120">
          <template 
            slot-scope="scope">
            <el-button 
              @click = "handleDetalle(scope.row)"
              type   = "text"
              size   = "small">Detalle
            </el-button>
            <el-button 
              @click = "handleEditar(scope.row)"
              type   = "text"
              size   = "small">Editar
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

  <el-dialog
    :title         = "titleText"
    :visible.sync = "dialogVisible"
    :width         = "transaction != 'eliminar' ? '20%' : '50%' ">

    <el-row  v-if="!inputDisabled" :gutter="20" class="inputline">
      <el-col :span="24">
        <el-input 
          placeholder = "Nombre tienda"
          size        = "small"
          v-model     = "store.storename">
        </el-input>
      </el-col>
    </el-row>

    <el-row  v-if="transaction == 'eliminar'" :gutter="20" class="inputline">
      <el-col :span="24">
        <el-table 
          :data="deleteItems">
          <el-table-column 
            prop  = "storename"
            label = "Nombre">
          </el-table-column>
          <el-table-column 
            prop  = "phone"
            label = "Telefono">
          </el-table-column>
          <el-table-column 
            prop  = "address"
            label = "Direccion">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row v-if="transaction != 'eliminar'" :gutter="20" class="inputline">
      <el-col :span="24">
        <el-input 
          :disabled   = "inputDisabled"
          placeholder = "Direccion"
          size        = "small"
          v-model     = "store.address">
        </el-input>
      </el-col>
    </el-row>

    <el-row v-if="transaction != 'eliminar'" :gutter="20" class="inputline">
      <el-col :span="24">
        <el-input 
          :disabled = "inputDisabled"
          size           = "small"
          placeholder    = "Telefono"
          v-model        = "store.phone">
        </el-input>
      </el-col>
    </el-row>

    <span 
      slot  = "footer"
      class = "dialog-footer">
      <el-button 
        @click = "cancelarDialogo">Cancelar
      </el-button>
      <el-button 
        type   = "primary"
        @click = "okDialogo">Guardar
      </el-button>
    </span>
  </el-dialog>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      tableData       : [],
      selectionToggle : false,
      texto           : 'Textual',
      deleteItems     : [],
      dialogVisible   : false,
      titleText       : '',
      inputDisabled   : false,
      store           : {},
      transaction     : '',
    }
  },
  methods:{
    handleDetalle(row){
      this.titleText       = row.storename
      this.dialogVisible   = true
      this.store           = row
      this.transaction     = "detalle"
      this.inputDisabled   = true
    },
    handleEditar(row){
      this.titleText       = "Editar tienda"
      this.dialogVisible   = true
      this.store           = row
      this.transaction     = "editar"
    },
    crearTienda(){
      this.transaction     = "crear"
      this.titleText       = "Crear tienda"
      this.dialogVisible   = true
    },
    eliminarTienda(){
      this.selectionToggle = true
    },
    confirmarDelete(){
      this.titleText       = "Confirma que desea eliminar los siguientes registros?"
      this.dialogVisible   = true
      this.inputDisabled   = true
      this.transaction     = "eliminar"
    },
    selectionChange(val){
      this.deleteItems     = val
    },
    cancelarDialogo(){
      this.dialogVisible   = false
      this.resetDialogo()
    },
    okDialogo(){
      switch(this.transaction){
        case 'crear':
          console.log('crear tienda')
          console.log(this.store)
          axios.post(apibasepath+'/stores',this.store)
            .then((response) => {
              if (response.status == 200){
                this.tableData.push(response.data)
              }
            })
            .catch((error) => {
              console.log(error)
            })
            .finally(() => {
              this.resetDialogo()
            })
        break
        case 'detalle':
          this.resetDialogo()
        break
        case 'editar':
          axios.put(apibasepath+'/stores/'+this.store.id,this.store)
            .then((response) => {
              if (response.status == 200){
                let index = this.tableData.findIndex(store => store.id == response.data.id)
                this.tableData[index] = response.data
              }
            })
            .catch((error) => {
              console.log(error)
            })
            .finally(() => {
              this.resetDialogo()
            })
        break
        case 'eliminar':
          let params = []
          this.deleteItems.forEach((val,index)=>{
            params.push(val.id)
          })
          let items = {}
          items.ids = params
          axios.post(apibasepath+'/users/delete',items)
            .then((response) => {
              if (response.status == 200){
                this.tableData.forEach((storee,index)=>{
                  response.data.forEach((val)=>{
                    if (storee.id == val){
                      delete this.tableData[index]
                    }
                  })
                })
              }
            })
            .catch((error) => {
              console.log(error)
            })
            .finally(() => {
              this.$refs.multipleTable.clearSelection();
              this.resetDialogo()
              this.deleteItems = []
              this.selectionToggle = false
            })
        break
      }
      this.loadTiendas()
    },
    resetDialogo(){
      this.titleText     = ""
      this.store         = {}
      this.transaction   = ""
      this.inputDisabled = false
      this.dialogVisible = false
    },
    loadTiendas(){
      axios.get(apibasepath+'/stores')
        .then((response) => {
          this.tableData = response.data
          console.log(response)
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          console.log('Llamado finalizado')
        })
      }
  },
  mounted(){
    this.loadTiendas()
  },
  created(){
    console.log(this.texto)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .el-header {
    background-color: #F2F6FC;
    color: #333;
    line-height: 60px;
    border-radius: 20px;
  }
  .greenButtons{
    text-align: initial;
  }
  .redButtons{
    text-align: end;
  }
  .inputline{
    margin-bottom: 10px;
  }
</style>
