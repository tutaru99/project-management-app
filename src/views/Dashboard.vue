<template>
  <div>
    <el-main>
      <el-row type="flex">
        <el-col :span="10">
          <div>
            <h1>Projects</h1>
            <br>
            <div v-for="project in projectsData"
            :key="project.title">
              <div class="projectsWrapper">
                <h4>{{ project.title }}</h4>
                <p>{{ project.description }}</p>
                <p id="completed" v-if="project.completed == true">Completed</p>
                <p id="inProgress" v-else>In Progress</p>
                <el-row type="flex" justify="center">
                  <span id="dateCreated">Created: {{ project.createdAt.split("T").shift() }}</span>
                </el-row>
                <el-row type="flex" justify="end">
                  <el-link id="linkProject" href="" type="primary">Open Project</el-link>
                </el-row>
              </div>
            </div>
          </div>
        </el-col>
                <el-col :span="11" :offset="1">
          <DashboardComponent />
                </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
// @ is an alias to /src
import DashboardComponent from "@/components/DashboardComponent.vue";
import axios from "axios";

export default {
  name: "Dashboard",
  components: {
    DashboardComponent,
  },
  data() {
    return {
      projectsData: [],
      projectStatus: "",
    };
  },
  mounted() {
    this.getProjectsData();
  },
  methods: {
    async getProjectsData() {
      await axios
        .get("http://localhost:3000/api/projects")
        .then((response) => (this.projectsData = response.data, console.log(response))
      )
    },
  },
};
</script>

<style lang="scss" scoped>
@import "src/scss/_variables.scss";


/* Shitty CSS for now */
.projectsWrapper{
  border: 1px solid rgb(0, 0, 0);
  padding: 10px;
  margin: 10px;
}
#completed{
  color: lightgreen;
  font-weight: 700;
}
#inProgress{
  color: gold;
  font-weight: 700;
}
#dateCreated {
  font-size: 13px;
}
#linkProject{
  font-size: 16px;
}
</style>