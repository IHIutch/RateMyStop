<template>
  <CBox>
    <CBox>
      <CProgress :value="step * (100 / answers.length)" />
    </CBox>
    <Container>
      <CGrid template-columns="repeat(12, 1fr)" gap="6">
        <CBox grid-column-start="2" grid-column-end="12">
          <CBox my="4">
            <CHeading as="h1" font-size="2xl">{{ stop.stopName }}</CHeading>
            <CBox color="gray.500">
              <CText as="span" font-weight="semibold" mr="1">Stop ID: </CText>
              <CText as="span">{{ stop.stopCode }}</CText>
            </CBox>
          </CBox>
          <transition name="slide-fade" mode="out-in">
            <CBox
              :key="step"
              bg="white"
              shadow="sm"
              p="8"
              w="100%"
              rounded="lg"
            >
              <template v-if="step - 1 >= answers.length">
                <CBox>End</CBox>
              </template>
              <template v-if="step > 0">
                <CBox>
                  <CBox mb="4">
                    <CText>Question {{ step }} of {{ answers.length }}</CText>
                  </CBox>
                  <YesNoQuestion
                    v-if="answers[step - 1]"
                    v-model="answers[step - 1]"
                    :question="questions[answers[step - 1].questionId]"
                  />
                </CBox>
              </template>
              <template v-else>
                <CBox>
                  <CButton @click="next()">Start</CButton>
                </CBox>
              </template>
            </CBox>
          </transition>
        </CBox>
      </CGrid>
    </Container>
    <template v-if="step > 0 && answers[step - 1]">
      <CFlex
        position="fixed"
        w="100%"
        bottom="0"
        bg="white"
        shadow="sm"
        border-top-width="1px"
        p="3"
      >
        <CButton :is-disabled="step === 1" size="lg" @click="prev()"
          >Prev</CButton
        >
        <template v-if="step < answers.length">
          <CButton
            d="block"
            ml="auto"
            :is-disabled="answers[step - 1].value === ''"
            variant-color="blue"
            size="lg"
            @click="next()"
          >
            Next
          </CButton>
        </template>
        <template v-else>
          <CButton
            ml="auto"
            variant-color="blue"
            :is-loading="isSaving"
            :is-disabled="answers[step - 1].value === ''"
            size="lg"
            @click="submit()"
          >
            Finish & Submit
          </CButton>
        </template>
      </CFlex>
    </template>
  </CBox>
</template>

<script>
import Container from '~/components/global/Container.vue'
import YesNoQuestion from '~/components/questionTypes/YesNoQuestion.vue'
import { getQuestions } from '~/lib/api/questions'
import { getStop } from '~/lib/api/stops'

export default {
  name: 'SurveyPage',
  components: { Container, YesNoQuestion },
  data() {
    return {
      isSaving: false,
      answerCount: 5,
      answers: [],
      watcherStatus: [],
    }
  },
  async fetch({ store, route, $http }) {
    if (
      !store.getters['stops/getUniqueStop'] ||
      store.getters['stops/getUniqueStop'].id !== parseInt(route.params.stopId)
    ) {
      const data = await getStop($http, route.params.stopId)
      store.dispatch('stops/fetchUniqueStop', data)
    }
    if (!store.getters['questions/getAllQuestions']) {
      const data = await getQuestions($http)
      store.dispatch('questions/fetchAllQuestions', data)
    }
  },
  computed: {
    step() {
      return parseInt(this.$route.hash ? this.$route.hash.replace('#', '') : 0)
    },
    stop() {
      return this.$store.getters['stops/getUniqueStop']
    },
    questions() {
      return this.$store.getters['questions/getAllQuestions']
    },
  },
  mounted() {
    const questionIds = this.getRandomQuestionIds()
    this.answers = questionIds.map((id) => {
      return {
        questionId: id,
        value: '',
      }
    })
  },
  methods: {
    async submit() {
      this.isSaving = true
      await this.$http.$post(`/survey/${this.stop.stopId}`, {
        answers: this.answers,
        status: this.watcherStatus,
      })
      this.$router.replace(`/survey/${this.stop.stopId}/thank-you`)
    },
    next() {
      this.$router.push(`#${this.step + 1}`)
    },
    prev() {
      this.$router.go(-1)
    },
    getRandomQuestionIds() {
      this.watcherStatus = [...this.stop.watcher.status]
      return [...new Array(this.answerCount)].reduce((acc) => {
        let idx = null
        do {
          idx = Math.floor(Math.random() * this.watcherStatus.length)
        } while (acc.includes(this.watcherStatus[idx]))
        const questionId = this.watcherStatus[idx]
        this.watcherStatus.splice(idx, 1)
        if (!this.watcherStatus.length)
          this.watcherStatus = Object.keys(this.questions).map((id) =>
            parseInt(id)
          )
        return [...acc, questionId]
      }, [])
    },
  },
}
</script>

<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>
