import { defineStore } from 'pinia'
// import ApiService from "./common";
import * as d3 from 'd3';


export const useWebStore = defineStore('web', {
  state: () => ({
    counter: 0,
    institutions: [],
    materials: [],
    documents: [],
    all_documents: [],
    all_projects: [],
    main_projects: [],
    global_config: null,
  }),
  actions: {
    async sendResponse(data) {
      try {
        const { post } = useApi();

        let response = await post(`/oej/response/`, data);
        return response.data
      } catch (error) {
        console.error(error);
      }
    },
    async saveFile([response_id, file_data]) {
      try {
        console.log('response_id', response_id)
        const { post } = useApi();

        let response = await post(
          `/oej/response/${response_id}/add_file/`, file_data,
          {headers: {
            'Content-Type': 'multipart/form-data'
          }});
        return response.data
      } catch (error) {
        console.error(error);
      }
    },
    setInstitutions(institutions) {
      this.institutions = institutions.body.sort((a, b) => d3.ascending(a.name, b.name))
    },
    setMaterials(materials) {
      this.materials = materials;
    },
    setDocuments(documents) {
      // console.log('setting documents', documents)
      this.documents = documents
    },
    setAllDocuments(stories) {
      // console.log('setting all documents', stories)
      let documents = stories.reduce((acc, story) => {
        // console.log('story', story)
        if (story.content.document.length > 0){
          let doc = story.content.document[0]
          doc.slug = story.slug
          doc.full_slug = story.full_slug
          acc.push(doc)
        }
        return acc
      }, [])
      documents = documents.sort((a, b) => d3.descending(a.date_start, b.date_start))
      this.all_documents = documents
      // console.log('all_documents', this.all_documents)
    },
    setAllProjects(stories) {
      // console.log('setting all documents', stories)
      let projects = stories.reduce((acc, story) => {
        acc.push(story)
        return acc
      }, [])
      // console.log('projects', projects)
      this.all_projects = projects
      // console.log('this.all_projects', this.all_projects)
    },
    setGlobalConfig(config) {
      console.log('setting footer config', config)
      this.global_config = config
    }
  },
  getters: {
    getCounter() {
      return this.counter
    }
  }
})



