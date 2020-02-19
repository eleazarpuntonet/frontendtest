<template>
  <el-container>
    <el-header style="text-align: right; font-size: 12px">
      <el-row>
        <el-col :span="12" class="greenButtons">
          <el-button 
            type   = "primary"
            size   = "small"
            @click = "crearCliente()"
            round>Crear cliente</el-button>
          <el-button 
            @click = "eliminarCliente()"
            size   = "small"
            :disabled = "selectionToggle"
            type   = "warning"
            round>Eliminar cliente
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
        height="500"
        ref="multipleTable"
        @selection-change="selectionChange"
        :data="tableData">
        <template v-if="selectionToggle">
          <el-table-column
            type  = "selection"
            width = "55">
          </el-table-column>
        </template>
        <el-table-column 
          prop  = "name"
          label = "Nombre">
        </el-table-column>
        <el-table-column 
          prop  = "last_name"
          label = "Apellido">
        </el-table-column>
        <el-table-column 
          prop  = "email"
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
    width         = "50%"
    :before-close = "cerrarDialogo">

    <el-row  v-if="!inputDisabled" :gutter="20" class="inputline">
      <el-col :span="24">
        <el-input 
          placeholder="Nombre" 
          size="small"
          v-model="client.name"></el-input>
      </el-col>
      <el-col :span="12">
        <el-input 
          placeholder="Apellido" 
          size="small"
          v-model="client.last_name"></el-input>
      </el-col>
    </el-row>

    <el-row  v-if="inputDisabled" :gutter="20" class="inputline">
      <el-col :span="24">
        <el-table 
          :data="deleteItems">
          <el-table-column 
            prop  = "name"
            label = "Nombre">
          </el-table-column>
          <el-table-column 
            prop  = "last_name"
            label = "Apellido">
          </el-table-column>
          <el-table-column 
            prop  = "email"
            label = "Email">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row v-if="transaction != 'eliminar'" :gutter="20" class="inputline">
      <el-col :span="15">
        <el-input 
          :disabled = "inputDisabled"
          size           = "small"
          placeholder    = "Correo electronico"
          v-model        = "client.email">
          <template slot = "prepend">@</template>
        </el-input>
      </el-col>
      <el-col :span="9">
        <el-radio 
          :disabled = "inputDisabled"
          v-model = "client.gender"
          label   = "Male">Masculino
        </el-radio>
        <el-radio 
          :disabled = "inputDisabled"
          v-model = "client.gender"
          label   = "Female">Femenino
        </el-radio>
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
      dialogVisible : false,
      titleText : '',
      inputDisabled : false,
      client : {},
      transaction: '',
    }
  },
  methods:{
    handleDetalle(row){
      this.titleText     = row.name+" "+row.last_name
      this.dialogVisible = true
      this.client        = row
      this.transaction = "detalle"
      this.inputDisabled = true
    },
    handleEditar(row){
      this.titleText     = "Editar cliente"
      this.dialogVisible = true
      this.client        = row
      this.transaction = "editar"
    },
    crearCliente(){
      this.transaction = "crear"
      this.titleText     = "Crear cliente"
      this.dialogVisible = true
    },
    eliminarCliente(){
      this.selectionToggle = true
    },
    confirmarDelete(){
      this.titleText     = "Confirma que desea eliminar los siguientes registros?"
      this.dialogVisible = true
      this.inputDisabled = true
      this.transaction = "eliminar"
    },
    selectionChange(val){
      this.deleteItems = val
    },
    cerrarDialogo(){

    },
    cancelarDialogo(){
      this.dialogVisible = false
      this.resetDialogo()
    },
    okDialogo(){
      switch(this.transaction){
        case 'crear':
          axios.post(apibasepath+'/users',this.client)
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
        case 'editar':
          axios.put(apibasepath+'/users/'+this.client.id,this.client)
            .then((response) => {
              if (response.status == 200){
                let index = this.tableData.findIndex(client => client.id == response.data.id)
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
                this.tableData.forEach((cliente,index)=>{
                  response.data.forEach((val)=>{
                    if (cliente.id == val){
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
    },
    resetDialogo(){
      this.titleText     = ""
      this.client        = {}
      this.transaction = ""
      this.inputDisabled = false
      this.dialogVisible = false
    }
  },
  mounted(){
    axios.get(apibasepath+'/users')
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
