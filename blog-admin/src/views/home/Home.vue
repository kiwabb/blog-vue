<template>
  <div>
    <!-- 统计数据 -->
    <el-row :gutter="30">
      <el-col :span="8">
        <el-card>
          <div class="card-desc">
            <div class="card-title" style="display: inline!important;">访问量</div>
            <div class="card-count">{{ viewsCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div class="card-desc">
            <div class="card-title">用户量</div>
            <div class="card-count">{{ userCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div class="card-desc">
            <div class="card-title">文章量</div>
            <div class="card-count">{{ articleCount }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {getData} from "@/api/home";

export default {
  created() {
    this.getData();
  },
  data: function() {
    return {
      loading: true,
      type: 1,
      viewsCount: 0,
      messageCount: 0,
      userCount: 0,
      articleCount: 0,
      articleStatisticsList: [],
      tagDTOList: [],
      viewCount: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          }
        },
        color: ["#3888fa"],
        legend: {
          data: ["访问量"]
        },
        grid: {
          left: "0%",
          right: "0%",
          bottom: "0%",
          top: "10%",
          containLabel: true
        },
        xAxis: {
          data: [],
          axisLine: {
            lineStyle: {
              // 设置x轴颜色
              color: "#666"
            }
          }
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              // 设置y轴颜色
              color: "#048CCE"
            }
          }
        },
        series: [
          {
            name: "访问量",
            type: "line",
            data: [],
            smooth: true
          }
        ]
      },
      ariticleRank: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          }
        },
        color: ["#58AFFF"],
        grid: {
          left: "0%",
          right: "0%",
          bottom: "0%",
          top: "10%",
          containLabel: true
        },
        xAxis: {
          data: []
        },
        yAxis: {},
        series: [
          {
            name: ["浏览量"],
            type: "bar",
            data: []
          }
        ]
      },
      category: {
        color: [
          "#7EC0EE",
          "#FF9F7F",
          "#FFD700",
          "#C9C9C9",
          "#E066FF",
          "#C0FF3E"
        ],
        legend: {
          data: [],
          bottom: "bottom"
        },
        tooltip: {
          trigger: "item"
        },
        series: [
          {
            name: "文章分类",
            type: "pie",
            roseType: "radius",
            data: []
          }
        ]
      },
      userAreaMap: {
        tooltip: {
          formatter: function(e) {
            var value = e.value ? e.value : 0;
            return e.seriesName + "<br />" + e.name + "：" + value;
          }
        },
        visualMap: {
          min: 0,
          max: 1000,
          right: 26,
          bottom: 40,
          showLabel: !0,
          pieces: [
            {
              gt: 100,
              label: "100人以上",
              color: "#ED5351"
            },
            {
              gte: 51,
              lte: 100,
              label: "51-100人",
              color: "#59D9A5"
            },
            {
              gte: 21,
              lte: 50,
              label: "21-50人",
              color: "#F6C021"
            },
            {
              label: "1-20人",
              gt: 0,
              lte: 20,
              color: "#6DCAEC"
            }
          ],
          show: !0
        },
        geo: {
          map: "china",
          zoom: 1.2,
          layoutCenter: ["50%", "50%"], //地图中心在屏幕中的位置
          //   label: {
          //     normal: {
          //       show: !0,
          //       fontSize: "12",
          //       color: "rgba(0,0,0,0.7)"
          //     }
          //   },
          itemStyle: {
            normal: {
              borderColor: "rgba(0, 0, 0, 0.2)"
            },
            emphasis: {
              areaColor: "#F5DEB3",
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              borderWidth: 0
            }
          }
        },
        series: [
          {
            name: "用户人数",
            type: "map",
            geoIndex: 0,
            data: [],
            areaColor: "#0FB8F0"
          }
        ]
      }
    };
  },
  methods: {
    getData() {
      getData().then(( data ) => {
        this.viewsCount = data.data.viewsCount;
        this.messageCount = data.data.messageCount;
        this.userCount = data.data.userCount;
        this.articleCount = data.data.articleCount;
        this.articleStatisticsList = data.data.articleStatisticsList;
        if (data.data.uniqueViewDTOList != null) {
          data.data.uniqueViewDTOList.forEach(item => {
            this.viewCount.xAxis.data.push(item.day);
            this.viewCount.series[0].data.push(item.viewsCount);
          });
        }

        if (data.data.categoryDTOList != null) {
          data.data.categoryDTOList.forEach(item => {
            this.category.series[0].data.push({
              value: item.articleCount,
              name: item.categoryName
            });
            this.category.legend.data.push(item.categoryName);
          });
        }

        if (data.data.articleRankDTOList != null) {
          data.data.articleRankDTOList.forEach(item => {
            this.ariticleRank.series[0].data.push(item.viewsCount);
            this.ariticleRank.xAxis.data.push(item.articleTitle);
          });
        }

        if (data.data.tagDTOList != null) {
          data.data.tagDTOList.forEach(item => {
            this.tagDTOList.push({
              id: item.id,
              name: item.tagName
            });
          });
        }

        this.loading = false;
      });
    },
  },
  watch: {
    type() {
      this.listUserArea();
    }
  }
};
</script>

<style scoped>
.card-icon-container {
  display: inline-block;
  font-size: 3rem;
}
.area-wrapper {
  display: flex;
  justify-content: center;
}
.card-desc {
  font-weight: bold;
  /*float: right;*/
}
.card-title {
  margin-top: 0.3rem;
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 1rem;
}
.card-count {
  margin-top: 0.75rem;
  color: #666;
  font-size: 1.25rem;
}
.echarts {
  width: 100%;
  height: 100%;
}
.e-title {
  font-size: 13px;
  color: #202a34;
  font-weight: 700;
}
</style>
