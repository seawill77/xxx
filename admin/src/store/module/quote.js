import issueService from '@/sdk/issueService'
import problemService from '@/sdk/problemService'
import quoteService from '@/sdk/quoteService'

const CLEAN_STATE = {
  total: 0,
  inspectionTotal: 0,
  plan: 0,
  detail: {},

}

const state = { ...CLEAN_STATE }

const actions = {
  changeFilter({ commit, dispatch, state, rootState }, payload, config = {}) {
    commit('page', 1)
    commit('filter', state.filter)
  },

  changeEditStatus({ commit, dispatch, state, rootState }, payload, config = {}) {
    commit('edit', payload)
  },
  async countByVehicle({ commit, dispatch, state, rootState }, payload, config = {}) {
    // 这个等后端确定api路径，车辆相关的是包括issue & inspection的总quote
    let rest = await issueService.countByVehicle(payload)
    if (rest.code !== 'SUCCESS') {
      dispatch('failBox/onRest', rest, { root: true })
      return
    }
    commit('total', rest.data)
  },

  async loadById({ commit, dispatch, state, rootState }, payload, config = {}) {
    let rest = await issueService.loadById(payload)
    if (rest.code !== 'SUCCESS') {
      dispatch('failBox/onRest', rest, { root: true })
      return
    }
    commit('detail', rest.data)
  },

  async count({ commit, dispatch, state, rootState }, payload, config = {}) {
    let rest = { data: 100, code: 'SUCCESS' }
    if (rest.code !== 'SUCCESS') {
      dispatch('failBox/onRest', rest, { root: true })
      return
    }
    commit('total', rest.data)
  },

  async load({ commit, dispatch, state, rootState }, payload, config = {}) {
    let rest = await issueService.load(state.filter)
    if (rest.code !== 'SUCCESS') {
      dispatch('failBox/onRest', rest, { root: true })
      return
    }
    commit('list', rest.data)
  },

  async loadProblemByIssue({ commit, dispatch, state, rootState }, payload, config = {}) {
    let rest = await problemService.loadByIssue(state.problem.filter, payload)
    if (rest.code !== 'SUCCESS') {
      dispatch('failBox/onRest', rest, { root: true })
      return
    }
    commit('problemList', rest.data)
    dispatch('loadQuoteByProblem', rest.data[0])
  },

  async loadQuoteByProblem({ commit, dispatch, state, rootState }, payload, config = {}) {
    let rest = await quoteService.loadByProblem(state.problem.filter, payload)
    if (rest.code !== 'SUCCESS') {
      dispatch('failBox/onRest', rest, { root: true })
      return
    }
    commit('quoteList', rest.data)
  },

  goPage({ commit, dispatch, state, rootState }, payload, config = {}) {
    commit('page', payload)
  },
}

const mutations = {
  list(state, e) {
    state.list = e
  },
  detail(state, e) {
    state.detail = e
  },
  problemList(state, e) {
    state.problem.list = e
  },
  quoteList(state, e) {
    state.quote.list = e
  },

  edit(state, e) {
    state.quote.edit = e
  },
  total(state, e) {
    state.total = e
    state.page.max = e / state.filter.limit + (e % state.filter.limit === 0 ? 0 : 1)
  },
  page(state, e) {
    state.page.curr = e
    state.filter.start = (e - 1) * state.filter.limit
  },
  filter(state, e) {
    state.filter = e
  },
}

export default {
  namespaced: true, state, actions, mutations,
}
