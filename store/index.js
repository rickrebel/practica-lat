import { defineStore } from 'pinia'
// import ApiService from "./common";
import colorMixin from "~/mixins/colorMixin";
import {status_filters} from "~/composables/filters.js";
// import { mande } from 'mande'
import qs from 'qs';
import * as d3 from 'd3';

const calculate_status = (status_control) => {
  return status_control.reduce((obj, st) => {
    st = colorMixin.methods.getComplementColor(st)
    if (obj[st.group])
      obj[st.group].push(st)
    else
      obj[st.group] = [st]
    return obj
  }, {})
}

const calculateSchemas = (data) => {
  let filter_groups = data.filter_groups.map(fg => {
    return {...fg, ...fg.addl_config}
  })
  const filters_dict = filter_groups.reduce((obj, fg) => {
    obj[fg.key_name] = fg
    return obj
  }, {})
  const has_fields = [
    "comments", "description", "help_text", "order", "color", "icon"]
  // const name_fields = ["name", "title", "description"]
  const name_fields = ["name", "title"]
  let collections = data.collections.map(coll => {
    coll.catalog_groups = filter_groups.reduce((arr, new_fg) => {
      if (new_fg.main_collection !== coll.snake_name)
        return arr
      if (new_fg.category_group)
        new_fg.category_groups = data[new_fg.category_group] || []
      return [...arr, new_fg]
    }, [])
    const valid_relations = ['one_to_many', 'many_to_many']
    coll.child_relation_fields = coll.fields.filter(field => {
      return valid_relations.includes(field.relation_type)
    })
    const primary_key = coll.fields.find(f => f.primary_key)
    coll.pk = primary_key ? primary_key.name : 'id'
    name_fields.forEach(field => {
      if (coll.name_field)
        return
      if (coll.fields.some(f => f.name === field))
        coll.name_field = field
    })
    coll.has = has_fields.reduce((obj, field) => {
      obj[field] = coll.fields.some(f => f.name === field)
      return obj
    }, {})
    const other_fields = has_fields.concat([coll.pk, coll.name_field])
    coll.other_fields = coll.fields.filter(f =>
      !other_fields.includes(f.name) && f.relation_type === 'simple')

    const all_filters = coll.all_filters || []

    let available_sorts = [
      {
        title: "Más recientes",
        value: "-id"
      },
      {
        title: "Más antiguos",
        value: "id"
      },
    ]

    let collection_filters = all_filters.reduce((arr, f) => {
      if (!f.filter_name){
        arr.push({...f, order: 12, is_custom: true})
        return arr
      }
      const filter_data = filters_dict[f.filter_name]
      if (!filter_data){
        console.error("No filter data", f.filter_name)
        return arr
      }
      const new_filter = {...filter_data, ...f}
      if (filter_data.category_group){
        const category_groups = data[filter_data.category_group] || []
        category_groups.forEach(cg => {
          const short_name = `${new_filter.short_prev} ${cg.name}`
          const name = `${new_filter.prev} ${cg.name}`
          let current_filter = {
            name,
            short_name,
            category_group_value: cg.id,
            original_name: new_filter.name
          }
          arr.push({...new_filter, ...cg, ...current_filter})
        })
        return arr
      }
      arr.push(new_filter)
      return arr
    }, [])
    coll.is_category = coll.level.includes('category_')
    if (coll.is_category){
      const fg = filter_groups.find(fg => fg[coll.level] === coll.snake_name)
      // const fg = filters_dict[coll.snake_name]
      if (fg){
        coll.filter_group = fg
        const short_level = coll.level.replace('category_', '')
        const new_filter_group = {
          ...fg,
          short_name: `${fg.short_prev} ${fg.name}`,
          name: `${fg.prev} ${fg.name}`,
          original_name: fg.name,
          forced_level: short_level,
          order: 1,
          hide_in_filter: false,
        }
        collection_filters.push(new_filter_group)
      }
    }

    const status_groups = coll.fields.reduce((arr, field)=>{
      if (field.related_model === 'StatusControl')
        arr.push(field.name)
      return arr
    }, [])
    coll.status_groups = status_groups
    status_groups.forEach(sg => {
      const status = status_filters[sg]
      collection_filters.push(status)
      available_sorts.push({
        value: `${status.collection}__order`,
        title: `Status ${status.name}`
      })
    })
    if (coll.name_field)
      available_sorts.push({
        title: "Nombre / Título",
        value: coll.name_field
      })
    if (coll.has.order)
      available_sorts.push({
        title: "Orden",
        value: "order"
      })
    collection_filters = collection_filters.sort((a, b) => a.order - b.order)

    coll.collection_filters = collection_filters
    coll.available_sorts = available_sorts
    return coll
  })

  let collections_dict = collections.reduce((obj, coll) => {
    obj[coll.snake_name] = coll
    obj[coll.model_name] = coll
    return obj
  }, {})
  return {
    "collections": collections,
    "collections_dict": collections_dict,
    "filter_groups": filter_groups,
    "levels": data.levels,
    "filters_dict": filters_dict,
  }
}

const calculateNewCats = (data, schemas) => {
  let all_nodes = {}
  schemas.filter_groups.forEach(fg => {
    if (fg.key_name === 'geographicals')
      return

    // console.log("filter_group:", fg.key_name, is_multiple)
    // v-else-if="!filter_box.category_group && !filter_box.category_type"
    const group_key = fg.category_group
    const type_key = fg.category_type
    const subtype_key = fg.category_subtype
    let subtypes = data[subtype_key] || []
    let types = data[type_key] || []
    let groups = data[group_key] || []

    const subtype_collection = schemas.collections_dict[subtype_key]
    // console.log("fg", fg)
    // console.log("subtype_key", subtype_key)
    // console.log("subtype_collection", subtype_collection)
    let type_field = subtype_collection.fields.find(field =>
      field.related_snake_name === fg.category_type)
    if (type_field)
      type_field.is_multiple = type_field.relation_type === 'many_to_many'

    let root = {
      new_id: "root",
      parent: null,
      name: "root",
    }
    root = {...root, ...fg}
    let new_types = []
    let types_dict = {}
    const first_group = groups[0]
    if (type_key){
      const some_is_empty = subtypes.some(st => {
        const type_value = st[type_field.name]
        if (typeof Array.isArray(type_value))
          return !type_value.length
        return !type_value
      })
      if (some_is_empty){
        let new_type ={
          id: 'empty',
          new_id: "type_empty",
          name: 'Desconocido ⚠️',
          original_types: null,
          color: "red",
          icon: "error_outline",
          is_mix: true,
        }
        if (group_key)
          new_type[group_key] = first_group.id
        new_types.push(new_type)
      }
    }

    subtypes = subtypes.map(st => {
      if (type_field && type_field.is_multiple){
        let all_types = st[type_field.name]
        all_types.forEach(t => {
          if (!types_dict[t])
            types_dict[t] = []
          types_dict[t].push(st)
        })
        if (all_types.length === 1)
          st.parent_id = `type_${all_types[0]}`
        else if (!all_types.length){
          st.parent_id = "type_empty"
          // console.log("No first type", st)
        }
        else{
          let new_type_key = ''
          const join_id = all_types.join('_')
          const names = all_types.map(t =>
            types.find(tt => tt.id === t).name)
          if (group_key){
            const first_type = types.find(t => t.id === all_types[0])
            new_type_key = first_type[group_key]
          }
          st.parent_id = `type_${join_id}`
          if (!new_types.find(t => t.id === join_id)){
            let new_type = {
              id: join_id,
              name: `Mixto: ${names.join(', ')}`,
              original_types: all_types.map(t =>
                types.find(tt => tt.id === t)),
              new_id: `type_${join_id}`,
              color: "black",
              icon: "group_work",
              is_mix: true,
            }
            if (group_key)
              new_type[group_key] = new_type_key
            new_types.push(new_type)
          }
        }
      }
      else if (type_key)
        st.parent_id = `type_${st[type_field.name]}`
      else
        st.parent_id = "root"
      st.new_id = `subtype_${st.id}`
      return st
    })
    types = [...types, ...new_types]
    types = types.map(type => {
      if (group_key && !type[group_key]) {
        console.log("No group key", type)
      }
      type.parent_id = group_key ? `group_${type[group_key]}` : "root"
      type.new_id = `type_${type.id}`
      if (type_field.is_multiple)
        type.all_childs = types_dict[type.id]
      return type
    })
    groups = groups.map(g => {
      g.parent_id = "root"
      g.new_id = `group_${g.id}`
      return g
    })
    const all_data = [...subtypes, ...types, ...groups, root]

    try{
      all_nodes[fg.key_name] = d3.stratify()
        .id(d => d.new_id)
        .parentId(d => d.parent_id)
        (all_data)
    }
    catch (e){
      console.log("Error", e)
      console.log("all_data", all_data)
      console.log("subtype_key", subtype_key)
      console.log("type_key", type_key)
      console.log("group_key", group_key)

      console.log("subtypes", subtypes)
      console.log("types", types)
      console.log("groups", groups)
    }
  })
  // console.log("new_cats", all_nodes)
  return all_nodes
}

function getLastId(data) {
  const id = data.id || data.key_name
  const method = id ? 'PUT' : 'POST'
  const last_id = id ? `${id}/` : ''
  return { method, last_id }
}

export const useMainStore = defineStore('main', {
  state: () => ({
    cats: null,
    all_nodes: {},
    schemas: {},
    cats_ready: false,
    status: {},
    impact_groups: {social: [], environmental: []},
    current_filter_group: null,
    current_filter_group_data: null,
    current_collection: null,
    current_collection_data: null,
    full_geo: {"state": {}, "municipality": {}},
  }),
  actions: {
    setFilterGroup(group) {
      console.log("setFilterGroup", group)
      this.current_filter_group = group
      console.log("cats_ready", this.cats_ready)
      if (this.cats_ready)
        this.setFilterGroupData()
    },
    setFilterGroupData() {
      console.log("setFilterGroupData", this.current_filter_group)
      this.current_filter_group_data = this.all_nodes[
        this.current_filter_group]
    },
    setCollection(group) {
      this.current_collection = group
      if (this.cats_ready)
        this.setCollectionData()
    },
    setCollectionData() {
      this.current_collection_data = this.schemas.collections_dict[
        this.current_collection]
    },
    async fetchCatalogs() {
      // console.log("fetchCatalogs init")

      try {
        const { get } = useApi();
        const response = await get('/catalogs/all/')
          // .then(({data}) => {
          // console.log("fetchCatalogs data", data)
        this.cats = response
        this.schemas = calculateSchemas(response)
        // console.log("schemas", this.schemas)
        this.all_nodes = calculateNewCats(response, this.schemas)
        this.status = calculate_status(response.status_control)
        this.setCollectionData()
        this.setFilterGroupData()
        this.cats_ready = true
        console.log("fetchCatalogs end")
        return response
          // })
      } catch (error) {
        console.error(error)
      }
    },
    async getSimple([group, id]) {
      try {
        const { get, setAuthHeader } = useApi();
        setAuthHeader();
        return await get(`/${group}/${id}/`);
      } catch (error) {
        console.error(error)
        ;
      }
    },
    async getGeo([group, id]) {
      if (this.full_geo[group][id])
        return
      this.full_geo[group][id] = []
      try {
        const { get, setAuthHeader } = useApi();
        setAuthHeader();

        let response = await get(`space_time/${group}/${id}/`);
        // console.log("getGeo", data)
        // this.full_states[id] = data.municipalities
        const child = group === 'state' ? 'municipalities' : 'localities'
        this.full_geo[group][id] = response[child]
        return response
      } catch (error) {
        console.error(error)
        ;
      }
    },
    // appendNewSources(response) {
    //   // const new_sources = response.data.new_sources
    //   this.cats.source = response.all_sources
    //   this.all_nodes['source'] = calculateFilterGroup(
    //     this.cats, this.schemas.filters_dict.sources)
    // },
    async sendQuery([id, params]) {
      try {
        const { post, setAuthHeader } = useApi();
        setAuthHeader();

        let response = await post(`/search_query/${id}/search/`, params);
        // this.appendNewSources(response)
        this.cats.source = response.all_sources
        this.all_nodes = calculateNewCats(this.cats, this.schemas)
        return response
      } catch (error) {
        console.error(error);
      }
    },
    async searchApplyQuery(id) {
      try {
        const { get, setAuthHeader } = useApi();
        setAuthHeader();

        let response = await get(`/apply_query/${id}/search/`);
        // this.appendNewSources(response)
        this.cats.source = response.all_sources
        this.all_nodes = calculateNewCats(this.cats, this.schemas)
        return response
      } catch (error) {
        console.error(error);
      }
    },
    edit_source_value(data) {
      console.log("edit_source_value", data)
      if (!data.source || !data.source.id)
        return
      const index = this.cats.source.findIndex(el => el.id === data.source.id)
      this.cats.source[index] = data.source
      this.all_nodes = calculateNewCats(this.cats, this.schemas)
      // this.all_nodes['sources'] = calculateFilterGroup(
      //   this.cats, this.schemas.filters_dict.sources)
    },
    async savePreLink([id, data]) {
      try {
        const { patch, setAuthHeader } = useApi();
        setAuthHeader();
        let response = await patch(`/note_link/${id}/get_note_content/`, data);
        console.log("savePreLink", response)
        this.edit_source_value(response)
        return response
      } catch (error) {
        console.error(error);
        // this.edit_source_value(error.response.data)
        this.edit_source_value(error._data)
        return error._data
      }
    },
    async getAdditionalInfo(id) {
      try {
        const { get, setAuthHeader } = useApi();
        setAuthHeader();

        let response = await get(`/note_content/${id}/additional_info/`);
        // console.log("getAdditionalInfo", response.data)
        return response
      } catch (error) {
        console.error(error);
      }
    },
    async saveSimple([collection, data]) {

      const { method, last_id } = getLastId(data)
      try {
        const { apiFetch, setAuthHeader, apiFetchAuth } = useApi();
        // setAuthHeader();
        // return await apiFetch(`/${collection}/${last_id}`, {
        //   method: method,
        //   data: data,
        // });
        return await apiFetchAuth(`/${collection}/${last_id}`, {
          method: method,
          body: data,
        });
      } catch (error) {
        console.error(error);
        // return {errors: error.response.data}
        return {errors: error.response ? error.response.data : error.message}
      }
    },
    async saveCatalog([collection_data, data]) {
      // console.log("collection_data", collection_data)
      const { method, last_id } = getLastId(data)
      const collection = collection_data.snake_name
      const full_url = `catalogs/${collection}/${last_id}`
      try {
        const { apiFetchAuth } = useApi();
        // setAuthHeader();
        let response = await apiFetchAuth(full_url, {
          method: method,
          body: data,
        });
        // console.log("saveCatalog response", response)
        // let response = await ApiService[method](full_url, data);
        if (method === 'POST')
          this.cats[collection].push(response)
        else {
          const elem_id = response.id ? 'id' : 'key_name'
          const index = this.cats[collection].findIndex(
            el => el[elem_id] === response[elem_id])
          this.cats[collection][index] = response
        }
        this.all_nodes = calculateNewCats(this.cats, this.schemas)
        await nextTick()
        return response
      } catch (error) {
        console.error(error);
        // return {errors: error.response.data}
        return {errors: error.response ? error.response.data : error.message}
      }
    },
    async patchSimple([collection, id, data]) {
      try {
        const { patch, setAuthHeader } = useApi();
        setAuthHeader();

        let response = await patch(`/${collection}/${id}/`, data);
        return response
      } catch (error) {
        console.error(error);
      }
    },
    async deleteSimple([group, id]) {
      try {
        const { deleteData, setAuthHeader } = useApi();
        setAuthHeader();
        await deleteData(`/${group}/${id}/`);
        return id
      } catch (error) {
        console.error(error);
      }
    },
    async fetchElements([group, params]) {
      // console.log('fetchElements', group, params)
      try {
        const { get, setAuthHeader } = useApi();
        setAuthHeader();

        const result = await get(`/${group}/`, {
          params: params,
          paramsSerializer: params => {
            return qs.stringify(params, {arrayFormat: 'comma'})
          }
        })
        // if (group.includes('catalogs/')){
        //   const real_group = group.split('/')[1]
        // }
        return result
      } catch (error) {
        console.error(error)
      }
    },
    async deleteCatalog([collection_data, id]) {
      try {
        const { deleteData, setAuthHeader } = useApi();
        setAuthHeader();
        const collection = collection_data.snake_name
        await deleteData(`/catalogs/${collection}/${id}/`);
        this.cleanDelete(collection, id)
        return {success: true}
      } catch (error) {
        console.error(error);
        return {errors: error.response ? error.response.data : error.message}
      }
    },
    cleanDelete(collection, id) {
      const index = this.cats[collection].findIndex(
        el => el.id === id)
      this.cats[collection].splice(index, 1)
      this.all_nodes = calculateNewCats(this.cats, this.schemas)
    },

  },
  getters: {
    status_dict(state) {
      if (!state.cats)
        return {}
      if (!state.cats.status_control)
        return {}
      let status_dict = {}
      Object.keys(state.status).forEach(group_key=>{
        status_dict[group_key] = {}
        state.status[group_key].forEach(st=>{
          status_dict[group_key][st.name] = st
        })
      })
      // console.log("status_dict", status_dict)
      return status_dict
    },
    foreign_origin(state) {
      if (!state.cats)
        return null
      return state.cats.source_origin.find(so => so.name === 'Extranjera')
    },
    invalid_valid_option(state) {
      if (!state.cats)
        return null
      return state.cats.valid_option.find(vo => vo.name === 'Inválido')
    }
  },
})